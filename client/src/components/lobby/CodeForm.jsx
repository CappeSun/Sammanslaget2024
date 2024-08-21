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

const REGEXP_ONLY_DIGITS_AND_CHARS_REGEX = new RegExp(
  REGEXP_ONLY_DIGITS_AND_CHARS
)

const codeFormSchema = z.object({
  code: z.string().min(6).regex(REGEXP_ONLY_DIGITS_AND_CHARS_REGEX)
})

const CodeForm = ({ handleSubmit }) => {
  const form = useForm({
    resolver: zodResolver(codeFormSchema),
    defaultValues: {
      code: ''
    }
  })

  return (
    <section>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className='flex h-screen flex-col justify-between py-4'
        >
          <FormField
            control={form.control}
            name='code'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pin kåd</FormLabel>
                <FormControl>
                  <InputOTP
                    maxLength={6}
                    pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
                    {...field}
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button disabled={!form.formState.isValid} className='mt-4'>
            Gå vidare
          </Button>
        </form>
      </Form>
    </section>
  )
}

export default CodeForm
