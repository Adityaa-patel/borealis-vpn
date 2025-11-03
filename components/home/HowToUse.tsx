// File: borealis-vpn/components/home/HowToUse.tsx

interface StepProps {
  number: string;
  title: string;
  description: string;
}

function Step({ number, title, description }: StepProps) {
  return (
    <div className="flex">
      <div className="flex-shrink-0">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-600 text-2xl font-bold text-white">
          {number}
        </span>
      </div>
      <div className="ml-6">
        <h4 className="text-2xl font-semibold">{title}</h4>
        <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
          {description}
        </p>
      </div>
    </div>
  );
}

export function HowToUse() {
  return (
    <section className="bg-white py-20 dark:bg-gray-800">
      <div className="container mx-auto max-w-7xl px-4">
        <h2 className="mb-16 text-center text-4xl font-bold">
          How It Works
        </h2>
        <div className="space-y-12 md:space-y-16">
          <Step
            number="1"
            title="Create an Account"
            description="Sign up for a free or paid plan in under 60 seconds. All you need is an email."
          />
          <Step
            number="2"
            title="Request a Plan"
            description="Go to your account dashboard and request the plan that fits your needs. An admin will approve your request."
          />
          <Step
            number="3"
            title="Download & Connect"
            description="Once approved, download your OpenVPN config file from your account and connect securely."
          />
        </div>
      </div>
    </section>
  );
}
