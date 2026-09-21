import React, { useState, useEffect } from 'react';
import { ClassroomDatabaseState, ParticipantType } from './types';
import { realtimeDb, DEFAULT_INITIAL_STATE } from './lib/firebase';
import { EntryPortal } from './components/EntryPortal';
import { Navbar } from './components/Navbar';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { TeacherHub } from './components/admin/TeacherHub';
import { StudentView } from './components/student/StudentView';
import { TeacherAuthGate } from './components/admin/TeacherAuthGate';
import { FirebaseConfigModal } from './components/FirebaseConfigModal';
import { QRCodeModal } from './components/admin/QRCodeModal';
import { ContentManagerModal } from './components/admin/ContentManagerModal';
import { RankingModal } from './components/admin/RankingModal';
import { GradebookModal } from './components/admin/GradebookModal';
import { getQuestionsForSelectedCurriculum, CURRICULUM_COMPLETO_MINEDUC } from './data/mineducCurriculum';
import { CurriculumConfig } from './types';
import { Lock, GraduationCap } from 'lucide-react';

const STORAGE_KEY_AUTH = 'edumath_teacher_authenticated';

export default function App() {
  const [dbState, setDbState] = useState<ClassroomDatabaseState>(DEFAULT_INITIAL_STATE);
  const [isTeacherAuthenticated, setIsTeacherAuthenticated] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem(STORAGE_KEY_AUTH) === 'true';
    } catch {
      return false;
    }
  });

  const [currentView, setCurrentView] = useState<'portal' | 'admin' | 'student'>('portal');
  const [teacherSubView, setTeacherSubView] = useState<'hub' | 'live'>('hub');
  const [studentDefaultMode, setStudentDefaultMode] = useState<ParticipantType>('individual');

  const [isFirebaseConfigOpen, setIsFirebaseConfigOpen] = useState<boolean>(false);
  const [isQRModalOpen, setIsQRModalOpen] = useState<boolean>(false);
  const [isContentManagerOpen, setIsContentManagerOpen] = useState<boolean>(false);
  const [isRankingModalOpen, setIsRankingModalOpen] = useState<boolean>(false);
  const [isGradebookOpen, setIsGradebookOpen] = useState<boolean>(false);
  const [initialPin, setInitialPin] = useState<string>('');
  const [focusLossNotice, setFocusLossNotice] = useState<string | null>(null);

  // 1. URL Parameter Sync & Secure Navigation Routing
  useEffect(() => {
    const handleLocation = () => {
      const params = new URLSearchParams(window.location.search);
      const viewParam = params.get('view');
      const pinParam = params.get('pin');

      if (viewParam === 'admin') {
        setCurrentView('admin');
      } else if (viewParam === 'student' || pinParam) {
        setCurrentView('student');
        if (pinParam) setInitialPin(pinParam);
      } else {
        // Root view without parameters
        const isAuth = sessionStorage.getItem(STORAGE_KEY_AUTH) === 'true';
        if (isAuth) {
          setCurrentView('admin');
        } else {
          setCurrentView('portal');
        }
      }
    };

    handleLocation();
    window.addEventListener('popstate', handleLocation);
    return () => window.removeEventListener('popstate', handleLocation);
  }, []);

  // 2. Realtime Database Subscription
  useEffect(() => {
    const unsubscribe = realtimeDb.subscribe((state) => {
      setDbState(state);
    });
    return () => unsubscribe();
  }, []);

  // 3. Security: Prevent tab closing / navigation shortcuts (Ctrl+W, Ctrl+T, Ctrl+N, Alt+F4, etc.) in 'student' view
  useEffect(() => {
    if (currentView !== 'student') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const isCtrl = e.ctrlKey || e.metaKey;
      const key = e.key.toLowerCase();

      // Windows Key (Meta / Win / OS) detection
      const isMetaOrWin =
        e.key === 'Meta' ||
        e.key === 'OS' ||
        e.key === 'Win' ||
        e.code === 'OSLeft' ||
        e.code === 'OSRight' ||
        e.code === 'MetaLeft' ||
        e.code === 'MetaRight' ||
        e.metaKey;

      if (isMetaOrWin) {
        e.preventDefault();
        e.stopPropagation();
        try {
          navigator.clipboard?.writeText?.('');
        } catch {}
        return;
      }

      // Prevent PrintScreen / Screenshots
      if (
        e.key === 'PrintScreen' ||
        e.code === 'PrintScreen' ||
        e.key === 'Snapshot' ||
        (e.shiftKey && key === 's' && (e.metaKey || isMetaOrWin))
      ) {
        e.preventDefault();
        e.stopPropagation();
        try {
          navigator.clipboard?.writeText?.('');
        } catch {}
        return;
      }

      // Prevent Ctrl+W / Cmd+W (Close Tab) and Ctrl+Q
      if (isCtrl && (key === 'w' || key === 'q')) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }

      // Prevent Ctrl+T / Cmd+T (New Tab)
      if (isCtrl && key === 't') {
        e.preventDefault();
        e.stopPropagation();
        return;
      }

      // Prevent Ctrl+N / Cmd+N (New Window) or Shift+Ctrl+N (Incognito)
      if (isCtrl && key === 'n') {
        e.preventDefault();
        e.stopPropagation();
        return;
      }

      // Prevent Alt+F4 (Close Window)
      if (e.altKey && (e.key === 'F4' || e.code === 'F4')) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }

      // Prevent other combinations like Ctrl+Shift+W, Ctrl+Shift+T
      if (isCtrl && e.shiftKey && (key === 'w' || key === 't' || key === 'n')) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const isMetaOrWin =
        e.key === 'Meta' ||
        e.key === 'OS' ||
        e.key === 'Win' ||
        e.code?.startsWith('Meta') ||
        e.code?.startsWith('OS') ||
        e.metaKey;

      if (isMetaOrWin || e.key === 'PrintScreen' || e.code === 'PrintScreen' || e.key === 'Snapshot') {
        e.preventDefault();
        try {
          navigator.clipboard?.writeText?.('');
        } catch {}
      }
    };

    window.addEventListener('keydown', handleKeyDown, true);
    window.addEventListener('keyup', handleKeyUp, true);
    return () => {
      window.removeEventListener('keydown', handleKeyDown, true);
      window.removeEventListener('keyup', handleKeyUp, true);
    };
  }, [currentView]);

  // 4. Security: Fullscreenchange listener in App.tsx to auto-re-enter fullscreen if in 'student' view
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = !!(document.fullscreenElement || (document as any).webkitFullscreenElement);
      if (!isCurrentlyFullscreen && currentView === 'student') {
        // Attempt to re-enter fullscreen automatically
        try {
          const docEl = document.documentElement as any;
          if (docEl.requestFullscreen) {
            docEl.requestFullscreen().catch(() => {});
          } else if (docEl.webkitRequestFullscreen) {
            docEl.webkitRequestFullscreen();
          } else if (docEl.msRequestFullscreen) {
            docEl.msRequestFullscreen();
          }
        } catch {}
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
    };
  }, [currentView]);

  // 5. Security: Global window blur listener to immediately restore focus to document.body / documentElement
  useEffect(() => {
    if (currentView !== 'student') return;

    const handleWindowBlur = () => {
      try {
        window.focus();
        if (document.body) {
          document.body.focus();
        } else if (document.documentElement) {
          document.documentElement.focus();
        }
      } catch {}
    };

    window.addEventListener('blur', handleWindowBlur);
    return () => {
      window.removeEventListener('blur', handleWindowBlur);
    };
  }, [currentView]);

  // 6. Security: Detect tab visibility / minimization using document.visibilityState and log to Firebase
  useEffect(() => {
    if (currentView !== 'student') return;

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        const studentId = localStorage.getItem('mat_participant_id') || 'student_anonymous';
        const studentName = localStorage.getItem('mat_participant_name') || 'Estudiante';
        const timeStr = new Date().toLocaleTimeString('es-CL');
        const alertMsg = `Pérdida de foco detectada (${timeStr}) - ${studentName} cambió de pestaña o minimizó la ventana`;

        try {
          realtimeDb.reportSecurityAlert(
            studentId,
            'tab_attempt',
            `Pérdida de foco (document.visibilityState === 'hidden') en App.tsx a las ${timeStr} por ${studentName}`
          );
        } catch (err) {
          console.warn('Error reporting focus loss to Firebase:', err);
        }

        setFocusLossNotice(alertMsg);
      } else if (document.visibilityState === 'visible') {
        // Clear indicator after 5 seconds
        const timer = setTimeout(() => {
          setFocusLossNotice(null);
        }, 5000);
        return () => clearTimeout(timer);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [currentView]);

  // 7. Security: Prevent 'dragstart' and 'copy' when currentView is 'student'
  useEffect(() => {
    if (currentView !== 'student') return;

    const handlePreventDragAndCopy = (e: Event) => {
      e.preventDefault();
      if ((e as any).clipboardData) {
        try {
          (e as any).clipboardData.clearData();
        } catch {}
      }
    };

    document.addEventListener('dragstart', handlePreventDragAndCopy, true);
    document.addEventListener('copy', handlePreventDragAndCopy, true);
    return () => {
      document.removeEventListener('dragstart', handlePreventDragAndCopy, true);
      document.removeEventListener('copy', handlePreventDragAndCopy, true);
    };
  }, [currentView]);

  // 8. Security: Prevent 'contextmenu' on window exclusively when currentView is 'student'
  useEffect(() => {
    if (currentView !== 'student') return;

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
    };

    window.addEventListener('contextmenu', handleContextMenu, true);
    return () => {
      window.removeEventListener('contextmenu', handleContextMenu, true);
    };
  }, [currentView]);

  const handleNavigateToPortal = () => {
    setCurrentView('portal');
    const url = new URL(window.location.href);
    url.searchParams.delete('view');
    url.searchParams.delete('pin');
    window.history.pushState({}, '', url.toString());
  };

  const handleNavigateToAdmin = () => {
    setCurrentView('admin');
    setTeacherSubView('hub');
    const url = new URL(window.location.href);
    url.searchParams.set('view', 'admin');
    window.history.pushState({}, '', url.toString());
  };

  const handleNavigateToStudent = (mode: ParticipantType = 'individual') => {
    try {
      const doc = document as any;
      const docEl = document.documentElement as any;
      if (!document.fullscreenElement && !doc.webkitFullscreenElement) {
        if (docEl.requestFullscreen) {
          docEl.requestFullscreen().catch(() => {});
        } else if (docEl.webkitRequestFullscreen) {
          docEl.webkitRequestFullscreen();
        } else if (docEl.msRequestFullscreen) {
          docEl.msRequestFullscreen();
        }
      }
    } catch {}
    setStudentDefaultMode(mode);
    setCurrentView('student');
    const url = new URL(window.location.href);
    url.searchParams.set('view', 'student');
    window.history.pushState({}, '', url.toString());
  };

  const handleTeacherAuthSuccess = () => {
    setIsTeacherAuthenticated(true);
    setTeacherSubView('hub');
    try {
      sessionStorage.setItem(STORAGE_KEY_AUTH, 'true');
    } catch {}
    handleNavigateToAdmin();
  };

  const handleTeacherLogout = () => {
    setIsTeacherAuthenticated(false);
    setTeacherSubView('hub');
    try {
      sessionStorage.removeItem(STORAGE_KEY_AUTH);
    } catch {}
    handleNavigateToPortal();
  };

  const handleLaunchLiveFromHub = (courseKey: string, axisKey: string, selectedOAIds: string[]) => {
    const questions = getQuestionsForSelectedCurriculum(courseKey, axisKey, selectedOAIds);
    const gradeData = CURRICULUM_COMPLETO_MINEDUC[courseKey];
    const axisData = gradeData?.ejes[axisKey];
    
    const curriculumConfig: CurriculumConfig = {
      gradeKey: courseKey,
      grade: gradeData?.nivel || courseKey,
      axisId: axisKey,
      axisName: axisData?.nombre || axisKey,
      oasSelected: selectedOAIds,
    };

    realtimeDb.setCurriculumSession(curriculumConfig, questions);
    setTeacherSubView('live');
  };

  const isConnectedToCloud = realtimeDb.isConnectedToCloud();
  const hasActiveSession = (dbState.session.quizData?.length || 0) > 0;

  // ==========================================
  // VIEW 1: SMART ENTRY PORTAL
  // ==========================================
  if (currentView === 'portal') {
    return (
      <>
        <EntryPortal
          onSelectTeacher={handleTeacherAuthSuccess}
          onSelectStudent={(mode) => handleNavigateToStudent(mode)}
          onOpenGradebook={() => setIsGradebookOpen(true)}
        />
        {isGradebookOpen && (
          <GradebookModal
            isOpen={isGradebookOpen}
            onClose={() => setIsGradebookOpen(false)}
            students={dbState.students}
            session={dbState.session}
          />
        )}
      </>
    );
  }

  // ==========================================
  // VIEW 2: TEACHER / ADMIN ROUTE (AUTHENTICATED)
  // ==========================================
  if (currentView === 'admin') {
    if (!isTeacherAuthenticated) {
      return (
        <TeacherAuthGate
          onSuccess={handleTeacherAuthSuccess}
          onGoToStudentView={handleNavigateToPortal}
        />
      );
    }

    // Teacher Hub Landing Experience
    if (teacherSubView === 'hub') {
      return (
        <>
          <TeacherHub
            onLogout={handleTeacherLogout}
            onLaunchLiveClass={handleLaunchLiveFromHub}
            onOpenLiveDashboard={() => setTeacherSubView('live')}
            onOpenGradebook={() => setIsGradebookOpen(true)}
            isLiveSessionActive={hasActiveSession}
            data={dbState}
          />
          {isGradebookOpen && (
            <GradebookModal
              isOpen={isGradebookOpen}
              onClose={() => setIsGradebookOpen(false)}
              students={dbState.students}
              session={dbState.session}
            />
          )}
        </>
      );
    }

    // Live Classroom Projection & Monitoring View
    return (
      <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col selection:bg-indigo-500 selection:text-white">
        <Navbar
          data={dbState}
          onOpenFirebaseModal={() => setIsFirebaseConfigOpen(true)}
          onOpenContentModal={() => setIsContentManagerOpen(true)}
          onOpenQRModal={() => setIsQRModalOpen(true)}
          onOpenRankingModal={() => setIsRankingModalOpen(true)}
          onOpenGradebook={() => setIsGradebookOpen(true)}
          onGoToStudentView={() => handleNavigateToStudent('individual')}
          onLogoutTeacher={handleTeacherLogout}
        />

        <main className="flex-1 flex flex-col">
          <AdminDashboard
            data={dbState}
            onLogoutTeacher={handleTeacherLogout}
            onReturnToHub={() => setTeacherSubView('hub')}
          />
        </main>

        {/* Teacher Modals */}
        <FirebaseConfigModal
          isOpen={isFirebaseConfigOpen}
          onClose={() => setIsFirebaseConfigOpen(false)}
          isConnectedToCloud={isConnectedToCloud}
        />

        <QRCodeModal
          isOpen={isQRModalOpen}
          onClose={() => setIsQRModalOpen(false)}
          pin={dbState.session.pin}
        />

        <ContentManagerModal
          isOpen={isContentManagerOpen}
          onClose={() => setIsContentManagerOpen(false)}
          currentQuizTitle={dbState.session.title || 'Materia activa'}
        />

        <RankingModal
          isOpen={isRankingModalOpen}
          onClose={() => setIsRankingModalOpen(false)}
          session={dbState.session}
          students={dbState.students}
        />

        {isGradebookOpen && (
          <GradebookModal
            isOpen={isGradebookOpen}
            onClose={() => setIsGradebookOpen(false)}
            students={dbState.students}
            session={dbState.session}
          />
        )}
      </div>
    );
  }

  // ==========================================
  // VIEW 3: STUDENT ROUTE (INDIVIDUAL & COOPERATIVE GROUPS)
  // ==========================================
  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col selection:bg-indigo-500 selection:text-white relative">
      <main className="flex-1 flex flex-col">
        <StudentView
          data={dbState}
          initialPin={initialPin || dbState.session.pin}
          defaultMode={studentDefaultMode}
          onGoToPortal={handleNavigateToPortal}
        />
      </main>

      {/* Floating Indicator for Visibility Focus Loss */}
      {focusLossNotice && (
        <div className="fixed bottom-4 left-4 z-50 bg-rose-950/95 text-rose-100 border border-rose-500/80 px-4 py-2.5 rounded-2xl shadow-2xl flex items-center gap-2.5 text-xs font-bold backdrop-blur-md animate-in slide-in-from-bottom duration-200">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
          <span>{focusLossNotice}</span>
        </div>
      )}

      {/* Discreet Role Switcher / Teacher Door */}
      <div className="fixed bottom-2 right-2 opacity-30 hover:opacity-100 transition-opacity z-20">
        <button
          onClick={handleNavigateToPortal}
          className="p-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-600 text-[10px] flex items-center gap-1 font-mono"
          title="Cambiar de Rol / Salir"
        >
          <Lock className="w-3 h-3" />
          <span>Cambiar Rol</span>
        </button>
      </div>
    </div>
  );
}
