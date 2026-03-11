/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { analyzeResume, ResumeAnalysis } from './services/geminiService';
import { 
  FileText, 
  Search, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  ArrowRight,
  Award,
  Briefcase,
  Lightbulb,
  RefreshCcw
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function App() {
  const [resumeText, setResumeText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<ResumeAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!resumeText.trim()) {
      setError('Please paste your resume text first.');
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    try {
      const analysis = await analyzeResume(resumeText);
      setResult(analysis);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const reset = () => {
    setResult(null);
    setResumeText('');
    setError(null);
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] text-slate-900 font-sans selection:bg-indigo-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <FileText className="text-white w-5 h-5" />
            </div>
            <h1 className="font-semibold text-lg tracking-tight">ResumeAI</h1>
          </div>
          {result && (
            <button 
              onClick={reset}
              className="text-sm font-medium text-slate-500 hover:text-indigo-600 flex items-center gap-1 transition-colors"
            >
              <RefreshCcw className="w-4 h-4" />
              New Analysis
            </button>
          )}
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8 md:py-12">
        {!result ? (
          <div className="max-w-2xl mx-auto space-y-8">
            <div className="text-center space-y-3">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900">
                Evaluate your resume with AI
              </h2>
              <p className="text-slate-500 text-lg">
                Paste your resume text below to get instant feedback on your skills, experience, and overall suitability.
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-4">
              <div className="space-y-2">
                <label htmlFor="resume" className="text-sm font-semibold text-slate-700 uppercase tracking-wider">
                  Resume Content
                </label>
                <textarea
                  id="resume"
                  className="w-full h-64 p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none resize-none text-slate-700 leading-relaxed"
                  placeholder="Paste your resume text here (e.g., Contact Info, Summary, Skills, Experience...)"
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                />
              </div>

              {error && (
                <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg text-sm">
                  <AlertCircle className="w-4 h-4" />
                  {error}
                </div>
              )}

              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className={cn(
                  "w-full py-4 rounded-xl font-semibold text-white transition-all flex items-center justify-center gap-2",
                  isAnalyzing 
                    ? "bg-slate-400 cursor-not-allowed" 
                    : "bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] shadow-lg shadow-indigo-200"
                )}
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Analyzing Resume...
                  </>
                ) : (
                  <>
                    <Search className="w-5 h-5" />
                    Analyse Resume
                  </>
                )}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="p-4 space-y-2">
                <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="font-semibold">Skill Extraction</h3>
                <p className="text-sm text-slate-500">Automatically identify key technical and soft skills.</p>
              </div>
              <div className="p-4 space-y-2">
                <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto">
                  <Award className="w-6 h-6" />
                </div>
                <h3 className="font-semibold">Quality Score</h3>
                <p className="text-sm text-slate-500">Get a data-driven score based on industry standards.</p>
              </div>
              <div className="p-4 space-y-2">
                <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto">
                  <Lightbulb className="w-6 h-6" />
                </div>
                <h3 className="font-semibold">Smart Tips</h3>
                <p className="text-sm text-slate-500">Receive actionable suggestions for improvement.</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Results Header */}
            <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Analysis Results</h2>
                <p className="text-slate-500">Based on the content provided, here is your resume evaluation.</p>
              </div>
              <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div className="text-right">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Suitability Score</div>
                  <div className="text-4xl font-black text-indigo-600">{result.suitabilityScore}<span className="text-slate-300 text-2xl">/100</span></div>
                </div>
                <div className="w-16 h-16 rounded-full border-4 border-indigo-100 flex items-center justify-center relative">
                  <svg className="w-full h-full -rotate-90">
                    <circle
                      cx="32"
                      cy="32"
                      r="28"
                      fill="transparent"
                      stroke="currentColor"
                      strokeWidth="4"
                      className="text-slate-100"
                    />
                    <circle
                      cx="32"
                      cy="32"
                      r="28"
                      fill="transparent"
                      stroke="currentColor"
                      strokeWidth="4"
                      strokeDasharray={175.9}
                      strokeDashoffset={175.9 - (175.9 * result.suitabilityScore) / 100}
                      className="text-indigo-600 transition-all duration-1000 ease-out"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column: Skills & Experience */}
              <div className="lg:col-span-2 space-y-8">
                {/* Experience Summary */}
                <section className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                  <div className="flex items-center gap-2 text-indigo-600">
                    <Briefcase className="w-5 h-5" />
                    <h3 className="font-bold uppercase tracking-wider text-sm">Experience Summary</h3>
                  </div>
                  <p className="text-slate-700 leading-relaxed text-lg italic font-medium">
                    "{result.experienceSummary}"
                  </p>
                </section>

                {/* Extracted Skills */}
                <section className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                  <div className="flex items-center gap-2 text-indigo-600">
                    <CheckCircle2 className="w-5 h-5" />
                    <h3 className="font-bold uppercase tracking-wider text-sm">Extracted Skills</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {result.skills.map((skill, idx) => (
                      <span 
                        key={idx}
                        className="px-4 py-2 bg-slate-50 text-slate-700 rounded-full text-sm font-medium border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50 transition-colors cursor-default"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </section>
              </div>

              {/* Right Column: Suggestions */}
              <div className="space-y-8">
                <section className="bg-indigo-600 text-white p-8 rounded-3xl shadow-xl shadow-indigo-100 space-y-6 h-full">
                  <div className="flex items-center gap-2">
                    <Lightbulb className="w-5 h-5" />
                    <h3 className="font-bold uppercase tracking-wider text-sm">Improvement Tips</h3>
                  </div>
                  <ul className="space-y-4">
                    {result.suggestions.map((suggestion, idx) => (
                      <li key={idx} className="flex gap-3 group">
                        <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-indigo-300 shrink-0 group-hover:scale-150 transition-transform" />
                        <p className="text-indigo-50 leading-snug font-medium">{suggestion}</p>
                      </li>
                    ))}
                  </ul>
                  <div className="pt-4 border-t border-indigo-500/50">
                    <button 
                      onClick={reset}
                      className="w-full py-3 bg-white text-indigo-600 rounded-xl font-bold hover:bg-indigo-50 transition-colors flex items-center justify-center gap-2"
                    >
                      Try Another Resume
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </section>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="py-12 text-center text-slate-400 text-sm">
        <p>© {new Date().getFullYear()} ResumeAI Evaluator. Built for students.</p>
      </footer>
    </div>
  );
}
