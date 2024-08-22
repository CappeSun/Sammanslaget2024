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
import Input from '@/components/common/Input'
import { Button } from '@/components/common/Button'

const nameFormSchema = z.object({
  name: z.string().min(1)
})

const NameForm = ({ handleSubmit }) => {
  const form = useForm({
    resolver: zodResolver(nameFormSchema),
    defaultValues: {
      name: ''
    }
  })

  return (
    <section>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className='flex h-svh flex-col justify-between py-4'
        >
          <FormField
            control={form.control}
            name='name'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Användar namn</FormLabel>
                <FormControl>
                  <Input placeholder='Erik Lindberg' {...field} />
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

export default NameForm
