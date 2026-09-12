import { Control, Controller, FieldErrors, UseFormRegister } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UserRole } from '@/lib/auth-api';

const ROLE_OPTIONS: { value: UserRole; label: string }[] = [
  { value: 'member', label: 'Member' },
  { value: 'pm', label: 'PM' },
  { value: 'admin', label: 'Admin' },
];

export interface RegisterFormValues {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface RegisterProps {
  register: UseFormRegister<RegisterFormValues>;
  control: Control<RegisterFormValues>;
  errors: FieldErrors<RegisterFormValues>;
  apiError: string | null;
  loading: boolean;
  onSubmit: React.FormEventHandler<HTMLFormElement>;
}

export function Register({ register, control, errors, apiError, loading, onSubmit }: RegisterProps) {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Create an account</CardTitle>
        <CardDescription>Sign up to start tracking your projects.</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="flex flex-col gap-4" onSubmit={onSubmit} noValidate>
          <div className="flex flex-col gap-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" type="text" {...register('name', { required: 'Name is required' })} />
            {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              {...register('email', { required: 'Email is required' })}
            />
            {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              {...register('password', {
                required: 'Password is required',
                minLength: { value: 8, message: 'Password must be at least 8 characters' },
              })}
            />
            {errors.password && (
              <p className="text-sm text-destructive">{errors.password.message}</p>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="role">Role</Label>
            <Controller
              name="role"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <Select value={field.value} onValueChange={(value) => field.onChange(value ?? 'member')}>
                  <SelectTrigger id="role" className="w-full">
                    <SelectValue placeholder="Select a role">
                      {(value: string | null) =>
                        ROLE_OPTIONS.find((option) => option.value === value)?.label ??
                        'Select a role'
                      }
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {ROLE_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          {apiError && <p className="text-sm text-destructive">{apiError}</p>}
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Creating account...' : 'Create account'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
