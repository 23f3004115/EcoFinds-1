import { SignupForm } from '@/components/auth/signup-form';

export default function SignupPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight text-center mb-2 text-primary">Join EcoSwap</h1>
      <p className="text-center text-muted-foreground mb-8">Create an account to start buying and selling sustainably.</p>
      <SignupForm />
    </div>
  );
}
