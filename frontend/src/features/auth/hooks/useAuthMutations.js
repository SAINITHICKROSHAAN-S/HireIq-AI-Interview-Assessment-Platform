import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { loginUser, registerUser } from '../api/authApi';
import useAuth from '../../../hooks/useAuth';

export const useLoginMutation = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      // Save details globally in context & localStorage
      login(data.token, data.email, data.role);
      
      // Navigate to correct dashboard based on role
      const userRole = data.role.toUpperCase();
      if (userRole === 'RECRUITER') {
        navigate('/recruiter/dashboard', { replace: true });
      } else {
        navigate('/candidate/dashboard', { replace: true });
      }
    },
  });
};

export const useRegisterMutation = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: registerUser,
    onSuccess: (data) => {
      // Save details globally in context & localStorage
      login(data.token, data.email, data.role);
      
      // Navigate to correct dashboard based on role
      const userRole = data.role.toUpperCase();
      if (userRole === 'RECRUITER') {
        navigate('/recruiter/dashboard', { replace: true });
      } else {
        navigate('/candidate/dashboard', { replace: true });
      }
    },
  });
};
