"use client";

import { useState } from "react";
import Link from "next/link";
import {
  FileText,
  MessageSquare,
  Zap,
  Shield,
  Users,
  BookOpen,
  Briefcase,
  GraduationCap,
  Search,
  Brain,
  Clock,
  CheckCircle,
  ArrowRight,
  Star,
  Quote,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Navbar } from "@/components/navbar";

const features = [
  {
    icon: Brain,
    title: "AI-Powered Analysis",
    description:
      "Advanced natural language processing to understand and analyze your documents with human-like comprehension.",
  },
  {
    icon: Search,
    title: "Instant Information Retrieval",
    description:
      "Find specific information, data points, or concepts within seconds across hundreds of pages.",
  },
  {
    icon: MessageSquare,
    title: "Natural Conversations",
    description:
      "Chat with your documents as if you're talking to an expert who has read and understood every detail.",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description:
      "Get answers instantly without manually searching through pages of content.",
  },
  {
    icon: Shield,
    title: "Secure & Private",
    description:
      "Your documents are processed securely with enterprise-grade encryption and privacy protection.",
  },
  {
    icon: Clock,
    title: "Save Hours of Work",
    description:
      "Reduce document review time from hours to minutes with intelligent summarization and analysis.",
  },
];

const useCases = [
  {
    icon: Briefcase,
    title: "Business & Legal",
    description: "Analyze contracts, reports, and legal documents",
    examples: [
      "Contract review and analysis",
      "Financial report insights",
      "Legal document research",
      "Compliance checking",
    ],
  },
  {
    icon: GraduationCap,
    title: "Education & Research",
    description: "Study materials, research papers, and academic content",
    examples: [
      "Research paper analysis",
      "Study guide creation",
      "Literature review",
      "Academic writing assistance",
    ],
  },
  {
    icon: BookOpen,
    title: "Content Creation",
    description: "Extract insights for blogs, articles, and presentations",
    examples: [
      "Content summarization",
      "Key point extraction",
      "Quote finding",
      "Reference gathering",
    ],
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description: "Share document insights across your organization",
    examples: [
      "Meeting preparation",
      "Document briefings",
      "Knowledge sharing",
      "Training materials",
    ],
  },
];

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Legal Analyst",
    company: "Morrison & Associates",
    content:
      "PDF Chat has revolutionized how we review contracts. What used to take hours now takes minutes.",
    rating: 5,
  },
  {
    name: "Dr. Michael Rodriguez",
    role: "Research Director",
    company: "Stanford University",
    content:
      "An invaluable tool for academic research. It helps me quickly understand complex papers and find relevant citations.",
    rating: 5,
  },
  {
    name: "Emily Johnson",
    role: "Content Manager",
    company: "TechCorp",
    content:
      "The ability to chat with our documentation has improved our content creation process dramatically.",
    rating: 5,
  },
];

const stats = [
  { number: "10M+", label: "Documents Processed" },
  { number: "500K+", label: "Active Users" },
  { number: "99.9%", label: "Uptime" },
  { number: "4.9/5", label: "User Rating" },
];

export default function LandingPage() {
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none"></div>
        <div className="container mx-auto px-4 py-20 lg:py-32">
          <div className="text-center max-w-4xl mx-auto">
            <Badge variant="secondary" className="mb-6 text-sm font-medium">
              🚀 AI-Powered Document Intelligence
            </Badge>

            <h1 className="text-4xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Chat with Your PDFs Like Never Before
            </h1>

            <p className="text-xl lg:text-2xl text-muted-foreground mb-8 leading-relaxed">
              Transform any PDF into an intelligent conversation partner. Ask
              questions, get insights, and unlock the knowledge hidden in your
              documents with advanced AI.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link href="/chat">
                <Button
                  size="lg"
                  variant="secondary"
                  className="text-lg px-8 py-6 group"
                >
                  Start Chatting Now
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="text-lg px-8 py-6">
                Watch Demo
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-2xl mx-auto">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl lg:text-3xl font-bold text-primary mb-1">
                    {stat.number}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Powerful Features for Document Intelligence
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Experience the future of document interaction with our
              cutting-edge AI technology
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20 cursor-pointer"
                onMouseEnter={() => setHoveredFeature(index)}
                onMouseLeave={() => setHoveredFeature(null)}
              >
                <CardHeader>
                  <div
                    className={`
                    w-12 h-12 rounded-lg flex items-center justify-center mb-4 transition-all duration-300
                    ${
                      hoveredFeature === index
                        ? "bg-primary text-primary-foreground scale-110"
                        : "bg-primary/10 text-primary"
                    }
                  `}
                  >
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <CardTitle className="text-xl group-hover:text-primary transition-colors">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-20 lg:py-32 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Perfect for Every Industry
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              From legal professionals to researchers, PDF Chat adapts to your
              specific needs
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {useCases.map((useCase, index) => (
              <Card
                key={index}
                className="group hover:shadow-lg transition-all duration-300"
              >
                <CardHeader>
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                      <useCase.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">{useCase.title}</CardTitle>
                      <CardDescription className="text-base">
                        {useCase.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {useCase.examples.map((example, exampleIndex) => (
                      <li
                        key={exampleIndex}
                        className="flex items-center space-x-2"
                      >
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">
                          {example}
                        </span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              How It Works
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Get started in three simple steps and unlock the power of your
              documents
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              {
                step: "01",
                title: "Upload Your PDF",
                description:
                  "Simply drag and drop your PDF document or click to browse and upload.",
                icon: FileText,
              },
              {
                step: "02",
                title: "AI Processing",
                description:
                  "Our advanced AI analyzes and understands your document content in seconds.",
                icon: Brain,
              },
              {
                step: "03",
                title: "Start Chatting",
                description:
                  "Ask questions, request summaries, or explore your document through conversation.",
                icon: MessageSquare,
              },
            ].map((step, index) => (
              <div key={index} className="text-center group">
                <div className="relative mb-6">
                  <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                    <step.icon className="w-8 h-8" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                    {step.step}
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 lg:py-32 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Loved by Professionals Worldwide
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              See what our users are saying about their PDF Chat experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                className="group hover:shadow-lg transition-all duration-300"
              >
                <CardContent className="pt-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                  <Quote className="w-8 h-8 text-primary/20 mb-4" />
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    "{testimonial.content}"
                  </p>
                  <div className="border-t pt-4">
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {testimonial.role} at {testimonial.company}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-32 bg-gradient-to-r from-primary to-primary/80">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-primary-foreground mb-4">
            Ready to Transform Your Document Workflow?
          </h2>
          <p className="text-xl text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
            Join thousands of professionals who are already saving hours every
            week with PDF Chat
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/chat">
              <Button
                size="lg"
                variant="secondary"
                className="text-lg px-8 py-6 group"
              >
                Get Started Free
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 py-6 border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground hover:text-primary"
            >
              Contact Sales
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-lg">
                <FileText className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-lg font-bold">PDF Chat</span>
            </div>
            <div className="text-sm text-muted-foreground">
              © 2025 PDF Chat. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
