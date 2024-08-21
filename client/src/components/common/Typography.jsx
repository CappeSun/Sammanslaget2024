import { cn } from '@/lib/util'

const Typography = ({
  variant = 'p',
  component,
  children,
  className,
  ...props
}) => {
  const Comp = component ?? variant

  const styles = {
    h1: 'font-light text-6xl tracking-tighter',
    h2: 'font-light text-5xl tracking-tight',
    h3: 'font-normal text-4xl tracking-normal',
    h4: 'font-normal text-3xl tracking-wide',
    h5: 'font-normal text-2xl tracking-normal',
    h6: 'font-medium text-2xl tracking-wide',
    subtitle1: 'font-normal text-base tracking-wide',
    subtitle2: 'font-medium text-sm tracking-wide',
    body1: 'font-normal text-base tracking-wider',
    body2: 'font-normal text-sm tracking-wide',
    button: 'font-normal text-lg tracking-tighter leading-tight',
    caption: 'font-normal text-xs tracking-wider',
    overline: 'font-normal text-[0.625rem] tracking-widest'
  }

  return (
    <Comp className={cn(styles[variant], className)} {...props}>
      {children}
    </Comp>
  )
}

export default Typography
