import { useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import AdminPanelLayout from '..'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { PasswordInput } from '@/components/custom/password-input'
import { useAuth } from '@/provider/authProvider'
import axios from 'axios'
import { toast } from 'sonner'
import { FilePreview } from '@/components/file-preview'

const formSchema = z
  .object({
    currentPassword: z
      .string()
      .min(1, { message: 'Please enter your current password' }),
    newPassword: z
      .string()
      .min(1, { message: 'Please enter your new password' })
      .min(6, { message: 'Password must be at least 6 characters long' }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })

type FormData = z.infer<typeof formSchema>

export default function ResetPassword() {
  const [loading, setLoading] = useState(false)
  const { setToken } = useAuth()

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  })

  const onSubmit = async (values: FormData) => {
    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/v1/auth/change-password`,
        {
          currentPassword: values.currentPassword,
          newPassword: values.newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      )

      toast.success(
        'Password changed successfully. Please login with your new password.'
      )

      // Reset form and log out user
      form.reset()
      setTimeout(() => {
        setToken(null)
      }, 1500)
    } catch (error) {
      console.error('Password change error:', error)
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data.message || 'An error occurred')
      } else {
        toast.error('An error occurred')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <AdminPanelLayout>
      <Card className='max-w-md mx-auto mt-12'>
        <CardHeader>
          <CardTitle>Reset Password</CardTitle>
          <CardDescription>
            Change your password by entering your current password and a new
            password
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
              <FormField
                control={form.control}
                name='currentPassword'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Password</FormLabel>
                    <FormControl>
                      <PasswordInput
                        placeholder='Enter current password'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='newPassword'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <PasswordInput
                        placeholder='Enter new password'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='confirmPassword'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm New Password</FormLabel>
                    <FormControl>
                      <PasswordInput
                        placeholder='Confirm new password'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type='submit'
                className='w-full bg-main'
                disabled={loading}
              >
                {loading ? 'Changing Password...' : 'Change Password'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </AdminPanelLayout>
  )
}
