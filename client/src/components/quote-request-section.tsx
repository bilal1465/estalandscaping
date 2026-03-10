import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { quoteRequestSchema, type QuoteRequest } from "@shared/schema";
import {
  Phone,
  Mail,
  ChevronRight,
  ChevronLeft,
  Check,
  Loader2,
  Sparkles,
  Clock,
  ShieldCheck,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import AnimateInView from "@/components/animate-in-view";

const STEPS = [
  { id: 1, title: "Contact", subtitle: "Your details" },
  { id: 2, title: "Service", subtitle: "What you need" },
  { id: 3, title: "Project", subtitle: "Tell us more" },
  { id: 4, title: "Review", subtitle: "Submit request" },
];

const SERVICES = [
  { value: "lawn-care", label: "Lawn Care & Maintenance" },
  { value: "sod-installation", label: "Sod Installation" },
  { value: "mulching", label: "Mulching" },
  { value: "seasonal-cleanup", label: "Seasonal Clean-Up" },
  { value: "garden-design", label: "Garden Bed Design" },
  { value: "custom-landscaping", label: "Custom Landscaping" },
];

const PROPERTY_SIZES = [
  { value: "small", label: "Less than ¼ acre" },
  { value: "medium", label: "¼ to ½ acre" },
  { value: "large", label: "½ to 1 acre" },
  { value: "xlarge", label: "More than 1 acre" },
];

const BUDGET_OPTIONS = [
  { value: "under-1k", label: "Under $1,000" },
  { value: "1k-5k", label: "$1,000 – $5,000" },
  { value: "5k-10k", label: "$5,000 – $10,000" },
  { value: "10k-plus", label: "$10,000+" },
  { value: "unsure", label: "Not sure yet" },
];

const TIMELINE_OPTIONS = [
  { value: "asap", label: "As soon as possible" },
  { value: "2-weeks", label: "Within 2 weeks" },
  { value: "1-month", label: "Within a month" },
  { value: "flexible", label: "Flexible" },
];

const PROPERTY_TYPES = [
  { value: "residential", label: "Residential" },
  { value: "commercial", label: "Commercial" },
  { value: "other", label: "Other" },
];

async function submitQuoteRequest(data: QuoteRequest): Promise<{ success: boolean; error?: string }> {
  const base = import.meta.env.VITE_API_URL || "";
  const res = await fetch(`${base}/api/quote`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      service: data.service,
      propertySize: data.propertySize || "",
      message: data.message,
      propertyType: data.propertyType || "",
      timeline: data.timeline || "",
      address: data.address || "",
      budgetRange: data.budgetRange || "",
    }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    const body = err as { error?: string; message?: string };
    return { success: false, error: body.message ?? body.error ?? "Something went wrong." };
  }
  return { success: true };
}

export default function QuoteRequestSection() {
  const [step, setStep] = useState(1);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [submitError, setSubmitError] = useState("");

  const form = useForm<QuoteRequest>({
    resolver: zodResolver(quoteRequestSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      service: "",
      propertySize: "",
      propertyType: "",
      timeline: "",
      message: "",
      address: "",
      budgetRange: "",
    },
  });

  const onNext = async () => {
    if (step >= 4) return;
    const fieldsByStep: Record<number, (keyof QuoteRequest)[]> = {
      1: ["firstName", "lastName", "email", "phone"],
      2: ["service"],
      3: ["message"],
    };
    const fields = fieldsByStep[step];
    const valid = fields
      ? await form.trigger(fields)
      : true;
    if (valid) setStep((s) => s + 1);
  };
  const onBack = () => {
    if (step > 1) setStep((s) => s - 1);
  };

  const onSubmit = async (data: QuoteRequest) => {
    setSubmitStatus("loading");
    setSubmitError("");
    const result = await submitQuoteRequest(data);
    if (result.success) {
      setSubmitStatus("success");
    } else {
      setSubmitStatus("error");
      setSubmitError(result.error || "Something went wrong while sending your request. Please try again or contact us directly.");
    }
  };

  // Success state
  if (submitStatus === "success") {
    return (
      <section id="contact" className="py-20 bg-beige">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimateInView>
            <div className="rounded-2xl bg-white p-10 shadow-lg">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-forest/10">
                <Check className="h-8 w-8 text-forest" />
              </div>
              <h2 className="text-2xl font-semibold text-forest font-serif mb-3">Thank you</h2>
              <p className="text-gray-600 mb-8">
                Your request has been received. Our team will review your project details and get back to you shortly.
              </p>
              <Button
                onClick={() => window.location.href = "#home"}
                className="bg-forest text-white hover:bg-forest/90"
              >
                Back to home
              </Button>
            </div>
          </AnimateInView>
        </div>
      </section>
    );
  }

  return (
    <section id="contact" className="py-20 bg-beige">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimateInView className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-forest font-serif mb-4">Request a Free Quote</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Tell us a bit about your project and we’ll get back to you with the next steps.
          </p>
        </AnimateInView>

        {/* Trust badges */}
        <AnimateInView className="flex flex-wrap justify-center gap-4 mb-12">
          {[
            { icon: ShieldCheck, text: "No obligation quote" },
            { icon: Clock, text: "Typically responds within 24 hours" },
            { icon: MapPin, text: "Locally trusted in Calgary" },
            { icon: Sparkles, text: "150+ projects completed" },
          ].map(({ icon: Icon, text }, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-sm text-gray-700 shadow-sm"
            >
              <Icon className="h-4 w-4 text-forest" />
              {text}
            </span>
          ))}
        </AnimateInView>

        <div className="grid lg:grid-cols-12 gap-10">
          {/* Main form card */}
          <div className="lg:col-span-8">
            <div className="rounded-2xl bg-white p-6 shadow-lg sm:p-8">
              {/* Progress */}
              <div className="mb-8">
                <div className="flex justify-between text-sm text-gray-500 mb-2">
                  {STEPS.map((s) => (
                    <span
                      key={s.id}
                      className={cn(
                        step >= s.id ? "text-forest font-medium" : "text-gray-400"
                      )}
                    >
                      {s.id}. {s.title}
                    </span>
                  ))}
                </div>
                <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-forest transition-all duration-300 ease-out"
                    style={{ width: `${(step / 4) * 100}%` }}
                  />
                </div>
              </div>

              {submitStatus === "error" && (
                <div className="mb-6 rounded-lg bg-red-50 p-4 text-sm text-red-800">
                  {submitError}
                </div>
              )}

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  {/* Step 1: Contact */}
                  {step === 1 && (
                    <div className="space-y-6">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="firstName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-gray-700">First Name</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="John"
                                  className="h-12 rounded-xl border-gray-200 focus-visible:ring-forest focus-visible:border-forest"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="lastName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-gray-700">Last Name</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Doe"
                                  className="h-12 rounded-xl border-gray-200 focus-visible:ring-forest focus-visible:border-forest"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700">Email</FormLabel>
                            <FormControl>
                              <Input
                                type="email"
                                placeholder="john@example.com"
                                className="h-12 rounded-xl border-gray-200 focus-visible:ring-forest focus-visible:border-forest"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700">Phone</FormLabel>
                            <FormControl>
                              <Input
                                type="tel"
                                placeholder="(555) 123-4567"
                                className="h-12 rounded-xl border-gray-200 focus-visible:ring-forest focus-visible:border-forest"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}

                  {/* Step 2: Service */}
                  {step === 2 && (
                    <div className="space-y-6">
                      <FormField
                        control={form.control}
                        name="service"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700">Service type</FormLabel>
                            <FormControl>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {SERVICES.map((s) => (
                                  <button
                                    key={s.value}
                                    type="button"
                                    onClick={() => field.onChange(s.value)}
                                    className={cn(
                                      "rounded-xl border-2 p-4 text-left text-sm font-medium transition-all duration-200",
                                      field.value === s.value
                                        ? "border-forest bg-forest/5 text-forest"
                                        : "border-gray-200 bg-white text-gray-700 hover:border-forest/50 hover:bg-gray-50"
                                    )}
                                  >
                                    {s.label}
                                  </button>
                                ))}
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="propertySize"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700">Property size (optional)</FormLabel>
                            <FormControl>
                              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                {PROPERTY_SIZES.map((p) => (
                                  <button
                                    key={p.value}
                                    type="button"
                                    onClick={() => field.onChange(p.value)}
                                    className={cn(
                                      "rounded-lg border py-2.5 text-xs font-medium transition-all duration-200",
                                      field.value === p.value
                                        ? "border-forest bg-forest/5 text-forest"
                                        : "border-gray-200 bg-white text-gray-600 hover:border-forest/50"
                                    )}
                                  >
                                    {p.label}
                                  </button>
                                ))}
                              </div>
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="propertyType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700">Property type (optional)</FormLabel>
                            <FormControl>
                              <div className="flex flex-wrap gap-2">
                                {PROPERTY_TYPES.map((p) => (
                                  <button
                                    key={p.value}
                                    type="button"
                                    onClick={() => field.onChange(p.value)}
                                    className={cn(
                                      "rounded-lg border py-2.5 px-4 text-sm transition-all duration-200",
                                      field.value === p.value
                                        ? "border-forest bg-forest/5 text-forest"
                                        : "border-gray-200 bg-white text-gray-600 hover:border-forest/50"
                                    )}
                                  >
                                    {p.label}
                                  </button>
                                ))}
                              </div>
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="timeline"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700">Preferred timeline (optional)</FormLabel>
                            <FormControl>
                              <div className="grid grid-cols-2 gap-2">
                                {TIMELINE_OPTIONS.map((t) => (
                                  <button
                                    key={t.value}
                                    type="button"
                                    onClick={() => field.onChange(t.value)}
                                    className={cn(
                                      "rounded-lg border py-2.5 text-sm transition-all duration-200",
                                      field.value === t.value
                                        ? "border-forest bg-forest/5 text-forest"
                                        : "border-gray-200 bg-white text-gray-600 hover:border-forest/50"
                                    )}
                                  >
                                    {t.label}
                                  </button>
                                ))}
                              </div>
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  )}

                  {/* Step 3: Project */}
                  {step === 3 && (
                    <div className="space-y-6">
                      <FormField
                        control={form.control}
                        name="message"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700">Project description</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Tell us about your landscaping project, goals, and any specific requests..."
                                className="min-h-[140px] rounded-xl border-gray-200 focus-visible:ring-forest focus-visible:border-forest resize-none"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700">Address or neighborhood (optional)</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="e.g. Calgary NW"
                                className="h-12 rounded-xl border-gray-200 focus-visible:ring-forest focus-visible:border-forest"
                                {...field}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="budgetRange"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700">Budget range (optional)</FormLabel>
                            <FormControl>
                              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                {BUDGET_OPTIONS.map((b) => (
                                  <button
                                    key={b.value}
                                    type="button"
                                    onClick={() => field.onChange(b.value)}
                                    className={cn(
                                      "rounded-lg border py-2.5 text-sm transition-all duration-200",
                                      field.value === b.value
                                        ? "border-forest bg-forest/5 text-forest"
                                        : "border-gray-200 bg-white text-gray-600 hover:border-forest/50"
                                    )}
                                  >
                                    {b.label}
                                  </button>
                                ))}
                              </div>
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  )}

                  {/* Step 4: Review */}
                  {step === 4 && (
                    <div className="rounded-xl border border-gray-200 bg-gray-50/50 p-6 space-y-4 text-sm">
                      <p><strong>Name:</strong> {form.watch("firstName")} {form.watch("lastName")}</p>
                      <p><strong>Email:</strong> {form.watch("email")}</p>
                      <p><strong>Phone:</strong> {form.watch("phone")}</p>
                      <p><strong>Service:</strong> {SERVICES.find(s => s.value === form.watch("service"))?.label || form.watch("service")}</p>
                      {form.watch("propertySize") && <p><strong>Property size:</strong> {PROPERTY_SIZES.find(p => p.value === form.watch("propertySize"))?.label}</p>}
                      {form.watch("propertyType") && <p><strong>Property type:</strong> {PROPERTY_TYPES.find(p => p.value === form.watch("propertyType"))?.label}</p>}
                      {form.watch("timeline") && <p><strong>Timeline:</strong> {TIMELINE_OPTIONS.find(t => t.value === form.watch("timeline"))?.label}</p>}
                      <p><strong>Project details:</strong> {form.watch("message")}</p>
                      {form.watch("address") && <p><strong>Address:</strong> {form.watch("address")}</p>}
                      {form.watch("budgetRange") && <p><strong>Budget:</strong> {BUDGET_OPTIONS.find(b => b.value === form.watch("budgetRange"))?.label}</p>}
                    </div>
                  )}

                  {/* Navigation */}
                  <div className="flex flex-col-reverse sm:flex-row gap-3 sm:justify-between pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={onBack}
                      className="rounded-xl border-gray-300"
                      disabled={step === 1}
                    >
                      <ChevronLeft className="mr-1 h-4 w-4" />
                      Back
                    </Button>
                    {step < 4 ? (
                      <Button
                        type="button"
                        onClick={onNext}
                        className="rounded-xl bg-forest text-white hover:bg-forest/90"
                      >
                        Next
                        <ChevronRight className="ml-1 h-4 w-4" />
                      </Button>
                    ) : (
                      <Button
                        type="submit"
                        disabled={submitStatus === "loading"}
                        className="rounded-xl bg-forest text-white hover:bg-forest/90"
                      >
                        {submitStatus === "loading" ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Sending...
                          </>
                        ) : (
                          "Submit Request"
                        )}
                      </Button>
                    )}
                  </div>
                </form>
              </Form>
            </div>
          </div>

          {/* Contact card */}
          <div className="lg:col-span-4">
            <AnimateInView stagger={1}>
              <div className="rounded-2xl bg-white p-6 shadow-lg lg:sticky lg:top-24">
                <h3 className="text-xl font-semibold text-forest font-serif mb-4">Contact us</h3>
                <p className="text-sm text-gray-500 mb-6">Prefer to talk? Reach out directly.</p>
                <div className="space-y-4">
                  <a
                    href="tel:8257332708"
                    className="flex items-center gap-3 rounded-xl border border-gray-100 p-4 transition-colors hover:bg-forest/5 hover:border-forest/20"
                  >
                    <Phone className="h-5 w-5 text-forest shrink-0" />
                    <div>
                      <div className="text-xs text-gray-500">Phone</div>
                      <div className="font-medium text-forest">(825) 733-2708</div>
                    </div>
                  </a>
                  <a
                    href="mailto:info.estalandscaping@gmail.com"
                    className="flex items-center gap-3 rounded-xl border border-gray-100 p-4 transition-colors hover:bg-forest/5 hover:border-forest/20"
                  >
                    <Mail className="h-5 w-5 text-forest shrink-0" />
                    <div>
                      <div className="text-xs text-gray-500">Email</div>
                      <div className="font-medium text-forest break-all">info.estalandscaping@gmail.com</div>
                    </div>
                  </a>
                </div>
                <p className="mt-4 text-xs text-gray-400">Typically responds within 24 hours</p>
              </div>
            </AnimateInView>
          </div>
        </div>
      </div>
    </section>
  );
}
