import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Brain,
  CheckCircle2,
  FileText,
  ClipboardList,
  Target,
} from "lucide-react";

import { processMeetingAI } from "../../services/aiService";

export default function MeetingProcessingPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [step, setStep] = useState(0);
  const [error, setError] = useState("");

  const steps = [
    {
      icon: FileText,
      title: "Collecting Meeting Transcript",
    },
    {
      icon: Brain,
      title: "Generating AI Summary",
    },
    {
      icon: ClipboardList,
      title: "Extracting Action Items",
    },
    {
      icon: Target,
      title: "Identifying Key Decisions",
    },
  ];

  useEffect(() => {
    let currentStep = 0;

    const interval = setInterval(() => {
      currentStep++;

      if (currentStep < steps.length) {
        setStep(currentStep);
      }
    }, 1500);

    const runAI = async () => {
      try {
        const result = await processMeetingAI(id!);

        clearInterval(interval);

        navigate(`/meetings/${id}/summary`, {
          state: result,
        });
      } catch (error) {
        console.error(error);

        clearInterval(interval);

        setError("Failed to generate AI insights.");
      }
    };

    runAI();

    return () => clearInterval(interval);
  }, [id, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">

        {/* Error Message */}
        {error && (
          <div className="mb-4 bg-red-500/10 border border-red-500 text-red-400 p-4 rounded-xl">
            {error}
          </div>
        )}

        {/* Main Card */}
        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl">

          {/* AI Icon */}
          <div className="flex justify-center">
            <div className="h-20 w-20 rounded-full bg-blue-500/20 flex items-center justify-center animate-pulse">
              <Brain className="h-10 w-10 text-blue-400" />
            </div>
          </div>

          {/* Header */}
          <div className="text-center mt-6">
            <h1 className="text-3xl font-bold text-white">
              AI Meeting Intelligence
            </h1>

            <p className="text-slate-400 mt-2">
              Please wait while AI analyzes your meeting...
            </p>
          </div>

          {/* Progress Steps */}
          <div className="mt-10 space-y-4">
            {steps.map((item, index) => {
              const Icon = item.icon;

              return (
                <div
                  key={index}
                  className={`flex items-center gap-4 p-4 rounded-xl border transition-all duration-500 ${
                    index <= step
                      ? "bg-blue-500/10 border-blue-500/30"
                      : "bg-slate-800/40 border-slate-700"
                  }`}
                >
                  {index < step ? (
                    <CheckCircle2 className="h-6 w-6 text-green-400" />
                  ) : (
                    <Icon
                      className={`h-6 w-6 ${
                        index === step
                          ? "text-blue-400 animate-pulse"
                          : "text-slate-500"
                      }`}
                    />
                  )}

                  <span
                    className={`font-medium ${
                      index <= step
                        ? "text-white"
                        : "text-slate-500"
                    }`}
                  >
                    {item.title}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Progress Bar */}
          <div className="mt-10">
            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 transition-all duration-700"
                style={{
                  width: `${((step + 1) / steps.length) * 100}%`,
                }}
              />
            </div>

            <p className="text-center text-sm text-slate-500 mt-4">
              AI is creating your meeting summary...
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}