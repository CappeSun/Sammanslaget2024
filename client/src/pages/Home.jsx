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

const codeSchema = z.object({
  code: z.string().min(1)
})

const Home = () => {
  const form = useForm({
    resolver: zodResolver(codeSchema),
    defaultValues: {
      code: ''
    }
  })

  const handleSubmit = values => {
    console.log(values)
  }

  return (
    <section>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <FormField
            control={form.control}
            name='code'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ange kåd</FormLabel>
                <FormControl>
                  <Input placeholder='12345678' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button disabled={!form.formState.isValid} className='mt-4'>
            Gå med
          </Button>
        </form>
      </Form>
    </section>
  )
}

export default Home
