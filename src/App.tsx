import { useState } from 'react';
import { useAuth } from './hooks/useAuth';
import { useProfile } from './hooks/useProfile';
import { useAppointments, useRegistrations } from './hooks/useActivities';
import { useHealthData } from './hooks/useHealthData';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Social from './pages/Social';
import Services from './pages/Services';
import Behavior from './pages/Behavior';
import Decision from './pages/Decision';
import Profile from './pages/Profile';
import Assessment from './pages/Assessment';
import ActivityDetail from './pages/ActivityDetail';
import ServiceDetail from './pages/ServiceDetail';
import ActivityRegistration from './pages/ActivityRegistration';
import ServiceRegistration from './pages/ServiceRegistration';
import ReservationSuccess from './pages/ReservationSuccess';
import ActivityList from './pages/ActivityList';
import ServiceList from './pages/ServiceList';
import SocialDetail from './pages/SocialDetail';
import BehaviorDetail from './pages/BehaviorDetail';
import DecisionDetail from './pages/DecisionDetail';
import Feedback from './pages/Feedback';
import PhysicalDataUpdate from './pages/PhysicalDataUpdate';
import HistoryList from './pages/HistoryList';
import AssessmentSubPage from './pages/AssessmentSubPage';
import ActivityDetailReport from './pages/ActivityDetailReport';
import BottomNav from './components/BottomNav';

/**
 * @description 应用外壳 - 处理认证状态
 * 未认证时显示 Login，已认证时渲染 AuthenticatedApp
 */
export default function App() {
  const { isAuthenticated, loading: authLoading, signOut } = useAuth();

  // 如果正在加载认证状态，显示加载界面
  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-100 dark:bg-slate-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <span className="text-text-sub dark:text-slate-400 text-sm font-medium">加载中...</span>
        </div>
      </div>
    );
  }

  // 未登录时显示登录页
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-100 dark:bg-slate-900 font-sans text-slate-800 dark:text-slate-200 flex justify-center">
        <div className="w-full max-w-md bg-background-light dark:bg-background-dark min-h-screen relative shadow-2xl overflow-hidden flex flex-col">
          <Login onLogin={() => { }} />
        </div>
      </div>
    );
  }

  // 已认证后才加载数据 hooks
  return <AuthenticatedApp signOut={signOut} />;
}

/**
 * @description 已认证的应用主体
 * 只有认证通过后才渲染此组件，确保数据 hooks 的 getUser() 能正常工作
 */
function AuthenticatedApp({ signOut }: { signOut: () => Promise<void> }) {
  const { profile, activeChild, refetch: refetchProfile } = useProfile();
  const { nextAppointment, createAppointment } = useAppointments();
  const { registrations, submitRegistration } = useRegistrations();
  const { healthScore, physicalData } = useHealthData(activeChild?.id || null);

  const [currentPage, setCurrentPage] = useState('dashboard');
  const [pageHistory, setPageHistory] = useState<string[]>(['dashboard']);
  const [bookingType, setBookingType] = useState<'activity' | 'service'>('activity');
  const [historyTitle, setHistoryTitle] = useState('');
  const [detailTitle, setDetailTitle] = useState('');
  const [servicesInitialTab, setServicesInitialTab] = useState<'public' | 'personal'>('public');
  const [highlightRequest, setHighlightRequest] = useState<string | undefined>(undefined);

  // 从报名记录中提取对应的活动和服务完整报名数据
  const activityRegistrations = registrations.filter(r => r.item_type === 'activity');
  const serviceRegistrations = registrations.filter(r => r.item_type === 'service');

  // 保留仅含标题的数组给 Services.tsx 概览组件使用
  const registeredActivities = activityRegistrations.map(r => r.item_title);
  const registeredServices = serviceRegistrations.map(r => r.item_title);

  // 将 Supabase 格式的下次预约映射为页面组件使用的格式
  const nextAppointmentMapped = nextAppointment ? {
    title: nextAppointment.title,
    date: nextAppointment.appointment_date,
    time: nextAppointment.appointment_time,
    type: nextAppointment.item_type as 'activity' | 'service',
  } : undefined;

  // 导航前进：将当前页压入历史栈
  const handleNavigate = (page: string) => {
    setPageHistory(prev => [...prev, currentPage]);
    setCurrentPage(page);
  };

  // 导航返回：从历史栈弹出上一页
  const goBack = () => {
    setPageHistory(prev => {
      const newHistory = [...prev];
      const lastPage = newHistory.pop() || 'dashboard';
      setCurrentPage(lastPage);
      return newHistory;
    });
  };

  const handleRegistrationSubmit = async (formData?: {
    childName: string;
    childAge: number;
    childGender: string;
    healthNotes: string;
    selectedDate: string;
    selectedTime: string;
    parentName: string;
    parentPhone: string;
  }) => {
    const title = detailTitle || (bookingType === 'activity' ? 'ADHD 儿童感统专注力训练营' : '一对一心理咨询与行为干预');

    try {
      const { data: { user } } = await (await import('./lib/supabase')).supabase.auth.getUser();
      if (!user) {
        alert('请先登录');
        return;
      }

      // 优先使用表单数据，其次使用 profile/activeChild 中的数据
      const childName = formData?.childName || activeChild?.full_name || '';
      const childAge = formData?.childAge || activeChild?.age || 0;
      const childGender = formData?.childGender || activeChild?.gender || '男';

      await submitRegistration({
        profile_id: user.id,
        child_id: activeChild?.id || user.id,
        item_type: bookingType,
        item_id: '',
        item_title: title,
        child_name: childName,
        child_age: childAge,
        child_gender: childGender,
        health_notes: formData?.healthNotes || '',
        selected_date: formData?.selectedDate || '',
        selected_time: formData?.selectedTime || '',
        parent_name: formData?.parentName || profile?.full_name || '',
        parent_phone: formData?.parentPhone || profile?.phone || '',
      });

      await createAppointment({
        profile_id: user.id,
        title,
        appointment_date: formData?.selectedDate || '10月28日',
        appointment_time: formData?.selectedTime || '14:00',
        item_type: bookingType,
      });

      // 提交成功后跳转
      handleNavigate('reservation_success');
    } catch (err) {
      console.error('报名失败:', err);
      alert('报名提交失败，请稍后重试');
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (err) {
      console.error('登出失败:', err);
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard': return <Dashboard
        onOpenProfile={() => handleNavigate('profile')}
        onOpenPhysicalDataUpdate={() => handleNavigate('physical_data_update')}
        onOpenNextAppointment={(type) => {
          setHighlightRequest(nextAppointmentMapped?.title);
          handleNavigate(type === 'activity' ? 'activity_list' : 'service_list');
        }}
        nextAppointment={nextAppointmentMapped}
        onOpenHistory={(category) => {
          setHistoryTitle(category === '全部' ? '全部记录' : category);
          handleNavigate('history_list');
        }}
        childName={activeChild?.full_name}
        profileName={profile?.full_name}
        profileRelation={profile?.relation}
        childCreatedAt={activeChild?.created_at}
        healthScore={healthScore}
        physicalData={physicalData}
      />;
      case 'social': return <Social onOpenTest={() => handleNavigate('assessment_subpage')} onOpenDetail={() => handleNavigate('social_detail')} onOpenService={(title) => { setDetailTitle(title || ''); setBookingType('service'); handleNavigate('service_detail'); }} onOpenActivity={(title) => { setDetailTitle(title || ''); setBookingType('activity'); handleNavigate('activity_detail'); }} onOpenHistory={() => { setHistoryTitle('社交能力'); handleNavigate('history_list'); }} onOpenFeedback={() => handleNavigate('feedback')} childId={activeChild?.id} />;
      case 'services': return <Services
        onOpenDetail={(type, title) => { setBookingType(type); setDetailTitle(title || ''); handleNavigate(type === 'activity' ? 'activity_detail' : 'service_detail'); }}
        onOpenActivityList={() => { setHighlightRequest(undefined); handleNavigate('activity_list'); }}
        onOpenServiceList={() => { setHighlightRequest(undefined); handleNavigate('service_list'); }}
        onOpenFeedback={() => handleNavigate('feedback')}
        registeredActivities={registeredActivities}
        registeredServices={registeredServices}
        initialTab={servicesInitialTab}
      />;
      case 'behavior': return <Behavior onOpenTest={() => handleNavigate('assessment_subpage')} onOpenDetail={() => handleNavigate('behavior_detail')} onOpenService={(title) => { setDetailTitle(title || ''); setBookingType('service'); handleNavigate('service_detail'); }} onOpenActivity={(title) => { setDetailTitle(title || ''); setBookingType('activity'); handleNavigate('activity_detail'); }} onOpenHistory={() => { setHistoryTitle('行为表现'); handleNavigate('history_list'); }} onOpenFeedback={() => handleNavigate('feedback')} childId={activeChild?.id} />;
      case 'decision': return <Decision onOpenTest={() => handleNavigate('assessment_subpage')} onOpenDetail={() => handleNavigate('decision_detail')} onOpenService={(title) => { setDetailTitle(title || ''); setBookingType('service'); handleNavigate('service_detail'); }} onOpenActivity={(title) => { setDetailTitle(title || ''); setBookingType('activity'); handleNavigate('activity_detail'); }} onOpenHistory={() => { setHistoryTitle('决策方式'); handleNavigate('history_list'); }} onOpenFeedback={() => handleNavigate('feedback')} childId={activeChild?.id} />;
      case 'profile': return <Profile onLogout={handleLogout} onBack={() => handleNavigate('dashboard')} profileName={profile?.full_name} profilePhone={profile?.phone} profileRelation={profile?.relation} childName={activeChild?.full_name} childAge={activeChild?.age || undefined} childGender={activeChild?.gender || undefined} profileId={profile?.id} childId={activeChild?.id} onProfileUpdated={refetchProfile} />;
      case 'test': return <Assessment onBack={goBack} />;
      case 'assessment_subpage': return <AssessmentSubPage onBack={goBack} />;
      case 'activity_detail_report': return <ActivityDetailReport onBack={goBack} title={detailTitle} childId={activeChild?.id} />;
      case 'social_detail': return <SocialDetail onBack={goBack} />;
      case 'behavior_detail': return <BehaviorDetail onBack={goBack} />;
      case 'decision_detail': return <DecisionDetail onBack={goBack} />;
      case 'activity_detail': return <ActivityDetail onBack={goBack} onRegister={() => handleNavigate('activity_registration')} title={detailTitle} />;
      case 'service_detail': return <ServiceDetail onBack={goBack} onRegister={() => handleNavigate('service_registration')} title={detailTitle} />;
      case 'activity_registration': return <ActivityRegistration onBack={goBack} onSubmit={handleRegistrationSubmit} title={detailTitle} defaultChildName={activeChild?.full_name} defaultChildAge={activeChild?.age?.toString()} defaultChildGender={activeChild?.gender} defaultParentName={profile?.full_name} defaultParentPhone={profile?.phone} />;
      case 'service_registration': return <ServiceRegistration onBack={goBack} onSubmit={handleRegistrationSubmit} title={detailTitle} defaultChildName={activeChild?.full_name} defaultChildAge={activeChild?.age?.toString()} defaultChildGender={activeChild?.gender} defaultParentName={profile?.full_name} defaultParentPhone={profile?.phone} />;
      case 'reservation_success': return <ReservationSuccess onViewAppointments={() => {
        setHighlightRequest(bookingType === 'activity' ? '已报名' : '待服务');
        handleNavigate(bookingType === 'activity' ? 'activity_list' : 'service_list');
      }} onBackHome={() => handleNavigate('dashboard')} title={detailTitle} />;
      case 'service_list': return <ServiceList
        onBack={goBack}
        onOpenDetail={(title) => { setDetailTitle(title || ''); setBookingType('service'); handleNavigate('service_detail'); }}
        onOpenDetailReport={(title) => { setDetailTitle(title || ''); handleNavigate('activity_detail_report'); }}
        onOpenFeedback={() => handleNavigate('feedback')}
        registrations={serviceRegistrations}
        initialFilter={highlightRequest || '全部'}
        childId={activeChild?.id}
        profileId={profile?.id}
        refetchRegistrations={submitRegistration}
      />;
      case 'activity_list': return <ActivityList
        onBack={goBack}
        onOpenDetail={(title) => { setDetailTitle(title || ''); setBookingType('activity'); handleNavigate('activity_detail'); }}
        onOpenDetailReport={(title) => { setDetailTitle(title || ''); handleNavigate('activity_detail_report'); }}
        onOpenFeedback={() => handleNavigate('feedback')}
        registrations={activityRegistrations}
        initialFilter={highlightRequest || '全部'}
        childId={activeChild?.id}
        profileId={profile?.id}
        refetchRegistrations={submitRegistration}
      />;
      case 'feedback': return <Feedback onBack={goBack} />;
      case 'physical_data_update': return <PhysicalDataUpdate onBack={goBack} onSubmit={goBack} />;
      case 'history_list': return <HistoryList onBack={() => {
        if (historyTitle === '社交能力') handleNavigate('social');
        else if (historyTitle === '行为表现') handleNavigate('behavior');
        else if (historyTitle === '决策方式') handleNavigate('decision');
        else handleNavigate('dashboard');
      }} title={historyTitle} onOpenDetail={(type, title) => {
        if (type === 'activity') {
          setDetailTitle(title || '');
          handleNavigate('activity_detail_report');
        } else {
          if (historyTitle === '社交能力') handleNavigate('social_detail');
          else if (historyTitle === '行为表现') handleNavigate('behavior_detail');
          else if (historyTitle === '决策方式') handleNavigate('decision_detail');
        }
      }} onOpenFeedback={() => handleNavigate('feedback')} childId={activeChild?.id} />;
      default: return <Dashboard
        onOpenProfile={() => handleNavigate('profile')}
        onOpenPhysicalDataUpdate={() => handleNavigate('physical_data_update')}
        onOpenNextAppointment={(type) => handleNavigate(type === 'activity' ? 'activity_list' : 'service_list')}
        nextAppointment={nextAppointmentMapped}
      />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 font-sans text-slate-800 dark:text-slate-200 flex justify-center">
      <div className="w-full max-w-md bg-background-light dark:bg-background-dark min-h-screen relative shadow-2xl overflow-hidden flex flex-col">
        {renderPage()}
        {currentPage !== 'login' && currentPage !== 'test' && currentPage !== 'assessment_subpage' && currentPage !== 'activity_detail_report' && currentPage !== 'profile' && currentPage !== 'activity_detail' && currentPage !== 'service_detail' && currentPage !== 'activity_registration' && currentPage !== 'service_registration' && currentPage !== 'reservation_success' && currentPage !== 'activity_list' && currentPage !== 'service_list' && currentPage !== 'social_detail' && currentPage !== 'behavior_detail' && currentPage !== 'decision_detail' && currentPage !== 'feedback' && currentPage !== 'physical_data_update' && currentPage !== 'history_list' && (
          <BottomNav currentTab={currentPage} setCurrentTab={handleNavigate} />
        )}
      </div>
    </div>
  );
}
