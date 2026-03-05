/**
 * @description 后台管理系统路由配置
 */
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import UserList from './pages/UserList';
import UserDetail from './pages/UserDetail';
import ActivityList from './pages/ActivityList';
import ServiceList from './pages/ServiceList';
import StaffList from './pages/StaffList';
import ScheduleList from './pages/ScheduleList';
import HealthOverview from './pages/HealthOverview';
import RegistrationList from './pages/RegistrationList';
import FeedbackList from './pages/FeedbackList';
import Settings from './pages/Settings';

const App: React.FC = () => {
    return (
        <Routes>
            <Route element={<Layout />}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/users" element={<UserList />} />
                <Route path="/users/:userId" element={<UserDetail />} />
                <Route path="/activities" element={<ActivityList />} />
                <Route path="/services" element={<ServiceList />} />
                <Route path="/staff" element={<StaffList />} />
                <Route path="/staff/schedule" element={<ScheduleList />} />
                <Route path="/health" element={<HealthOverview />} />
                <Route path="/registrations" element={<RegistrationList />} />
                <Route path="/feedback" element={<FeedbackList />} />
                <Route path="/settings" element={<Settings />} />
            </Route>
        </Routes>
    );
};

export default App;
