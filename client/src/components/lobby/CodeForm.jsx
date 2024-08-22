import { REGEXP_ONLY_DIGITS_AND_CHARS } from 'input-otp'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '../common/InputOTP'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/common/Form'
import { Button } from '@/components/common/Button'
import Typography from '../common/Typography'

const REGEXP_ONLY_DIGITS_AND_CHARS_REGEX = new RegExp(
  REGEXP_ONLY_DIGITS_AND_CHARS
)

const codeFormSchema = z.object({
  code: z.string().min(4).regex(REGEXP_ONLY_DIGITS_AND_CHARS_REGEX)
})

const CodeForm = ({ handleSubmit }) => {
  const form = useForm({
    resolver: zodResolver(codeFormSchema),
    defaultValues: {
      code: ''
    }
  })

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className='flex flex-grow flex-col items-center justify-between p-4 pt-16'
      >
        <FormField
          control={form.control}
          name='code'
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                <div className='mb-8 flex flex-col items-center gap-4'>
                  <Typography
                    className={'text-dark-purple text-4xl font-black'}
                  >
                    Dela Pin-Kod
                  </Typography>
                  <Typography className={'text-dark-purple text-xl'}>
                    Dela Pin-Koden med din medspelare
                  </Typography>
                </div>
              </FormLabel>
              <FormControl>
                <InputOTP
                  containerClassName='bg-white rounded-xl w-fit mx-auto'
                  maxLength={4}
                  pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
                  {...field}
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                  </InputOTPGroup>
                </InputOTP>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button disabled={!form.formState.isValid} className='mt-4 w-full'>
          Gå vidare
        </Button>
      </form>
    </Form>
  )
}

export default CodeForm
