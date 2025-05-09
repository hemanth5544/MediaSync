import { Ripple } from '../magicui/ripple'

export const Leave = () => {
  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
      <div className="text-center relative">
        <div className="absolute inset-0 -z-10">
          <Ripple />
        </div>
      </div>
    </div>
  );
};