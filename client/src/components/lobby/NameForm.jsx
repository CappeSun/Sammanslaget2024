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
import Typography from '../common/Typography'

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
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className='flex flex-grow flex-col justify-between p-4 pt-16'
      >
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                <div className='mb-8 flex flex-col items-center gap-4'>
                  <Typography
                    className={'text-dark-purple text-4xl font-black'}
                  >
                    Ange namn
                  </Typography>
                  <Typography className={'text-dark-purple text-xl'}>
                    Ge dig själv eller ditt lag ett namn
                  </Typography>
                </div>
              </FormLabel>
              <FormControl>
                <Input
                  className='border-medium-purple placeholder:text-medium-purple text-dark-purple h-14 border text-center text-xl'
                  placeholder='Namn'
                  {...field}
                />
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
  )
}

export default NameForm
