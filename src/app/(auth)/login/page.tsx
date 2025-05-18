import { LoginForm } from '@/components/auth/login-form';

export default function LoginPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight text-center mb-2 text-primary">Welcome Back!</h1>
      <p className="text-center text-muted-foreground mb-8">Log in to continue to EcoSwap.</p>
      <LoginForm />
    </div>
  );
}
