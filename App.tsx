
import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CLASSES, ACADEMIC_YEARS, MONTHS } from './constants.ts';
import { Board, DOB, AgeResult } from './types.ts';
import { calculateAge, validateAge, isValidDate } from './utils.ts';
import { 
  CheckCircle2, 
  AlertCircle, 
  Lightbulb, 
  School, 
  Printer, 
  Copy, 
  Calendar, 
  User, 
  ArrowRight,
  Info,
  CalendarDays,
  ChevronDown,
  Sparkles
} from 'lucide-react';

const App: React.FC = () => {
  const [selectedClassId, setSelectedClassId] = useState(CLASSES[0].id);
  const [dob, setDob] = useState<DOB>({ day: '', month: '', year: '' });
  const [board, setBoard] = useState<Board>(Board.PUNJAB);
  const [academicYear, setAcademicYear] = useState(ACADEMIC_YEARS[1]); 
  const [isAnimating, setIsAnimating] = useState(false);

  const selectedClass = useMemo(() => 
    CLASSES.find(c => c.id === selectedClassId) || CLASSES[0], 
  [selectedClassId]);

  const targetDate = useMemo(() => {
    const yearStart = parseInt(academicYear.split('-')[0]);
    // Cut-off date: 31st December of the starting year
    return new Date(yearStart, 11, 31);
  }, [academicYear]);

  const ageResult = useMemo((): AgeResult | null => {
    const d = Number(dob.day);
    const m = Number(dob.month);
    const y = Number(dob.year);

    if (d && m && y && isValidDate(d, m, y)) {
      const dobDate = new Date(y, m - 1, d);
      const calculated = calculateAge(dobDate, targetDate);
      return validateAge(calculated, selectedClass);
    }
    return null;
  }, [dob, targetDate, selectedClass]);

  useEffect(() => {
    if (ageResult) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 500);
      return () => clearTimeout(timer);
    }
  }, [ageResult?.isValid, selectedClassId]);

  const handleCopy = () => {
    if (!ageResult) return;
    const text = `Student Admission Eligibility\nBoard: ${board}\nClass: ${selectedClass.name}\nAge: ${ageResult.years}Y, ${ageResult.months}M\nStatus: ${ageResult.isValid ? 'Eligible' : 'Not Eligible'}`;
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  const handlePrint = () => window.print();

  return (
    <div className="min-h-screen relative flex flex-col items-center py-8 px-4 md:py-12 md:px-8">
      {/* Background blobs */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-50 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-50 rounded-full blur-[100px]"></div>
      </div>

      <div className="w-full max-w-5xl space-y-8">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-200">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-600 text-white text-[10px] font-bold tracking-widest uppercase">
              Pro Version 2.0
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 flex items-center gap-3">
              <School className="text-blue-600 w-12 h-12" />
              Smart Checker
            </h1>
            <p className="text-slate-500 font-medium">Pakistan School Board Age Verification System</p>
          </div>
          <div className="flex items-center gap-3 bg-white p-2 rounded-2xl shadow-sm border border-slate-200 no-print">
            <CalendarDays className="text-blue-500 ml-2" size={20} />
            <select 
              value={academicYear} 
              onChange={(e) => setAcademicYear(e.target.value)}
              className="bg-transparent border-none focus:ring-0 text-sm font-bold text-slate-700 cursor-pointer"
            >
              {ACADEMIC_YEARS.map(y => <option key={y} value={y}>Session: {y}</option>)}
            </select>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-7 space-y-6 no-print"
          >
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-8 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Education Board</label>
                  <div className="relative">
                    <select 
                      value={board} 
                      onChange={(e) => setBoard(e.target.value as Board)}
                      className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 px-5 text-slate-700 font-bold focus:border-blue-500 transition-all outline-none appearance-none"
                    >
                      {Object.values(Board).map(b => <option key={b} value={b}>{b}</option>)}
                    </select>
                    <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Target Class</label>
                  <div className="relative">
                    <select 
                      value={selectedClassId} 
                      onChange={(e) => setSelectedClassId(e.target.value)}
                      className={`w-full border-2 rounded-2xl py-4 px-5 font-bold transition-all outline-none appearance-none ${selectedClass.bgColor} ${selectedClass.textColor} border-current/10`}
                    >
                      {CLASSES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                    <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2" size={18} />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Student's Date of Birth</label>
                <div className="grid grid-cols-3 gap-4">
                  <input 
                    type="number" placeholder="DD" value={dob.day}
                    onChange={(e) => setDob({...dob, day: e.target.value})}
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-5 text-center text-2xl font-black text-slate-800 focus:border-blue-500 outline-none transition-all"
                  />
                  <select 
                    value={dob.month}
                    onChange={(e) => setDob({...dob, month: e.target.value})}
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-5 text-center text-lg font-black text-slate-800 focus:border-blue-500 outline-none appearance-none"
                  >
                    <option value="">Month</option>
                    {MONTHS.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}
                  </select>
                  <input 
                    type="number" placeholder="YYYY" value={dob.year}
                    onChange={(e) => setDob({...dob, year: e.target.value})}
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-5 text-center text-2xl font-black text-slate-800 focus:border-blue-500 outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            {ageResult && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                className="bg-blue-600 rounded-[2.5rem] p-8 flex gap-6 text-white shadow-xl shadow-blue-200"
              >
                <div className="bg-white/20 p-4 rounded-3xl h-fit">
                  <Lightbulb size={28} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-black tracking-tight">System Recommendation</h3>
                  <p className="text-blue-50 font-medium leading-relaxed">{ageResult.suggestion}</p>
                </div>
              </motion.div>
            )}
          </motion.section>

          <aside className="lg:col-span-5 w-full">
            <AnimatePresence mode="wait">
              {!ageResult ? (
                <motion.div 
                  key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="bg-slate-100 rounded-[2.5rem] border-2 border-dashed border-slate-300 h-full min-h-[400px] flex flex-col items-center justify-center p-12 text-center"
                >
                  <Calendar size={64} className="text-slate-300 mb-6" />
                  <p className="text-slate-500 font-bold text-lg leading-snug">Enter student's DOB to<br/>check eligibility</p>
                </motion.div>
              ) : (
                <motion.div 
                  key="result" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <div className={`rounded-[3rem] p-10 shadow-2xl overflow-hidden relative ${ageResult.isValid ? 'bg-slate-900 text-white' : 'bg-white border-2 border-rose-100'}`}>
                    {/* Background decoration */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-current opacity-5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                    
                    <div className="relative space-y-8">
                      <div className="flex justify-between items-center">
                        <div className={`p-4 rounded-3xl ${ageResult.isValid ? 'bg-white/10' : 'bg-rose-50'}`}>
                          <User className={ageResult.isValid ? 'text-emerald-400' : 'text-rose-500'} size={32} />
                        </div>
                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${ageResult.isValid ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-100 text-rose-600'}`}>
                          {ageResult.isValid ? 'Qualified' : 'Restricted'}
                        </span>
                      </div>

                      <div className="space-y-1">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">Total Age</p>
                        <h2 className="text-6xl font-black tracking-tighter">{ageResult.years} <span className="text-2xl opacity-40">Yrs</span></h2>
                        <p className="text-xl font-bold opacity-60">{ageResult.months} Months, {ageResult.days} Days</p>
                      </div>

                      <div className="pt-8 border-t border-current/10 flex justify-between items-end">
                        <div className="space-y-1">
                          <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Status</p>
                          <div className="flex items-center gap-2">
                            {ageResult.isValid ? <CheckCircle2 className="text-emerald-400" /> : <AlertCircle className="text-rose-500" />}
                            <span className={`text-xl font-black ${ageResult.isValid ? 'text-emerald-400' : 'text-rose-500'}`}>
                              {ageResult.isValid ? 'ELIGIBLE' : 'NOT ELIGIBLE'}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                           <p className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-1">Class</p>
                           <p className="text-2xl font-black">{selectedClass.name}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 no-print">
                    <button onClick={handlePrint} className="flex items-center justify-center gap-3 py-5 bg-white border border-slate-200 rounded-[2rem] font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-sm">
                      <Printer size={20} /> PRINT
                    </button>
                    <button onClick={handleCopy} className="flex items-center justify-center gap-3 py-5 bg-white border border-slate-200 rounded-[2rem] font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-sm">
                      <Copy size={20} /> COPY
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default App;
