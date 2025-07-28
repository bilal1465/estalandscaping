import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Phone, Mail, MapPin, Clock, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { insertContactRequestSchema, type InsertContactRequest } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";

export default function ContactSection() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<InsertContactRequest>({
    resolver: zodResolver(insertContactRequestSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      service: "",
      propertySize: "",
      message: ""
    }
  });

  const submitContactMutation = useMutation({
    mutationFn: async (data: InsertContactRequest) => {
      const response = await apiRequest("POST", "/api/contact", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Message sent successfully!",
        description: "We'll get back to you within 24 hours.",
      });
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/contact"] });
    },
    onError: (error) => {
      toast({
        title: "Error sending message",
        description: "Please try again or call us directly.",
        variant: "destructive",
      });
      console.error("Contact form error:", error);
    },
  });

  const onSubmit = (data: InsertContactRequest) => {
    submitContactMutation.mutate(data);
  };

  return (
    <section id="contact" className="py-20 bg-beige">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-forest font-serif mb-6">Get In Touch</h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Ready to transform your outdoor space? Contact us today for a free consultation and quote.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div>
            <Card className="shadow-lg mb-8">
              <CardContent className="p-8">
                <h3 className="text-2xl font-semibold text-forest font-serif mb-6">Contact Information</h3>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Phone className="text-forest text-xl mr-4 h-6 w-6" />
                    <div>
                      <div className="font-medium">Phone</div>
                      <div className="text-gray-600">(555) 123-4567</div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Mail className="text-forest text-xl mr-4 h-6 w-6" />
                    <div>
                      <div className="font-medium">Email</div>
                      <div className="text-gray-600">info@stalandscaping.com</div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="text-forest text-xl mr-4 h-6 w-6" />
                    <div>
                      <div className="font-medium">Address</div>
                      <div className="text-gray-600">123 Garden Way, Green Valley, CA 95945</div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Clock className="text-forest text-xl mr-4 h-6 w-6" />
                    <div>
                      <div className="font-medium">Business Hours</div>
                      <div className="text-gray-600">Mon-Sat: 7AM-6PM | Sun: Closed</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Google Maps Placeholder */}
            <Card className="shadow-lg">
              <CardContent className="p-8">
                <h3 className="text-2xl font-semibold text-forest font-serif mb-6">Find Us</h3>
                <div className="bg-gray-200 rounded-lg h-64 flex items-center justify-center">
                  <div className="text-center text-gray-600">
                    <MapPin className="mx-auto mb-4 h-12 w-12" />
                    <div>Interactive Map Coming Soon</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <Card className="shadow-lg">
            <CardContent className="p-8">
              <h3 className="text-2xl font-semibold text-forest font-serif mb-6">Send Us a Message</h3>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John" {...field} />
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
                          <FormLabel>Last Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Doe" {...field} />
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
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="john@example.com" {...field} />
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
                        <FormLabel>Phone</FormLabel>
                        <FormControl>
                          <Input type="tel" placeholder="(555) 123-4567" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="service"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Service Interested In</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a service" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="lawn-care">Lawn Care & Maintenance</SelectItem>
                            <SelectItem value="garden-design">Garden Bed Design</SelectItem>
                            <SelectItem value="sod-installation">Sod Installation</SelectItem>
                            <SelectItem value="mulching">Mulching</SelectItem>
                            <SelectItem value="seasonal-cleanup">Seasonal Clean-ups</SelectItem>
                            <SelectItem value="custom-landscaping">Custom Landscaping</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="propertySize"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Property Size</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select property size" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="small">Less than 1/4 acre</SelectItem>
                            <SelectItem value="medium">1/4 to 1/2 acre</SelectItem>
                            <SelectItem value="large">1/2 to 1 acre</SelectItem>
                            <SelectItem value="xlarge">More than 1 acre</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Project Details</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Tell us about your landscaping project..." 
                            className="min-h-[100px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button 
                    type="submit" 
                    className="w-full bg-forest text-white hover:bg-forest/90"
                    disabled={submitContactMutation.isPending}
                  >
                    <Send className="mr-2 h-4 w-4" />
                    {submitContactMutation.isPending ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
