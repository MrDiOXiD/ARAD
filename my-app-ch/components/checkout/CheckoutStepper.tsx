import { StepperStep } from "@/interfaces/checkout/types";

interface CheckoutStepperProps {
  steps: StepperStep[];
}

export default function CheckoutStepper({ steps }: CheckoutStepperProps) {
  return (
    <div className="stepper">
      {steps.map((step) => (
        <div key={step.key} className={`stepper-step stepper-step--${step.status}`}>
          <span className="stepper-step__line" />
          <span className="stepper-step__icon">
            <i className={`bi ${step.icon}`} />
          </span>
          <span className="stepper-step__label">{step.label}</span>
        </div>
      ))}
    </div>
  );
}
