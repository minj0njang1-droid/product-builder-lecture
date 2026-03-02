"use client";

import { useState, useEffect, useRef } from "react";

type Step = "HOME" | "WAITING" | "SEATING" | "PAYMENT" | "RESULT";
type Difficulty = "EASY" | "NORMAL" | "HARD";

interface Record {
  name: string;
  time: number;
  difficulty: Difficulty;
  date: string;
}

export default function TicketingDojo() {
  const [step, setStep] = useState<Step>("HOME");
  const [difficulty, setDifficulty] = useState<Difficulty>("NORMAL");
  const [timeLeft, setTimeLeft] = useState(5.0);
  const [gameTimer, setGameTimer] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [seats, setSeats] = useState<boolean[]>([]);
  const [isLagging, setIsLagging] = useState(false);
  const [rankings, setRankings] = useState<Record[]>([]);

  // 난이도별 설정
  const config = {
    EASY: { seatRatio: 0.7, limit: 999, label: "초급", color: "text-green-400" },
    NORMAL: { seatRatio: 0.4, limit: 30, label: "중급", color: "text-yellow-400" },
    HARD: { seatRatio: 0.1, limit: 15, label: "고급", color: "text-red-500" },
  };

  useEffect(() => {
    // 랭킹 로드 (실제 서비스라면 Firebase 연동 지점)
    const saved = localStorage.getItem("ticketing_rank");
    if (saved) {
      setRankings(JSON.parse(saved));
    } else {
      const mock = [
        { name: "티켓팅마스터", time: 3.24, difficulty: "HARD", date: "2026.03.01" },
        { name: "광클요정", time: 4.88, difficulty: "HARD", date: "2026.03.02" },
        { name: "포도알사냥꾼", time: 6.12, difficulty: "NORMAL", date: "2026.02.28" },
      ] as Record[];
      setRankings(mock);
    }
  }, []);

  const startSimulator = () => {
    setStep("WAITING");
    setTimeLeft(3.0);
  };

  useEffect(() => {
    if (step === "WAITING") {
      const interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 0.1) {
            clearInterval(interval);
            return 0;
          }
          return parseFloat((prev - 0.1).toFixed(1));
        });
      }, 100);
      return () => clearInterval(interval);
    }
  }, [step]);

  // 게임 제한시간 타이머
  useEffect(() => {
    if ((step === "SEATING" || step === "PAYMENT") && config[difficulty].limit < 999) {
      const interval = setInterval(() => {
        setGameTimer((prev) => {
          if (prev >= config[difficulty].limit) {
            clearInterval(interval);
            alert("시간 초과! 매진되었습니다.");
            setStep("HOME");
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [step, difficulty]);

  const enterHall = () => {
    if (timeLeft > 0) return;
    setStartTime(Date.now());
    setGameTimer(0);
    generateSeats();
    setStep("SEATING");
  };

  const generateSeats = () => {
    const ratio = config[difficulty].seatRatio;
    const newSeats = Array.from({ length: 100 }, () => Math.random() < ratio);
    setSeats(newSeats);
  };

  const selectSeat = async (isAvailable: boolean) => {
    if (!isAvailable || isLagging) return;
    
    if (difficulty === "HARD") {
      setIsLagging(true);
      await new Promise(r => setTimeout(r, 500)); // 0.5초 서버 렉
      setIsLagging(false);
    }
    setStep("PAYMENT");
  };

  const completePayment = (e: React.FormEvent) => {
    e.preventDefault();
    const endTime = Date.now();
    const totalElapsed = (endTime - startTime) / 1000;
    setElapsed(totalElapsed);
    
    // 랭킹 저장
    const newRecord = { 
      name: "나(User)", 
      time: totalElapsed, 
      difficulty, 
      date: new Date().toLocaleDateString() 
    };
    const updated = [...rankings, newRecord].sort((a, b) => a.time - b.time).slice(0, 5);
    setRankings(updated);
    localStorage.setItem("ticketing_rank", JSON.stringify(updated));
    
    setStep("RESULT");
  };

  const getRankEmoji = (time: number) => {
    if (time < 5) return "🥇 티켓팅의 신";
    if (time < 10) return "🥈 베테랑";
    return "🥉 고수";
  };

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center py-12 px-4 font-sans selection:bg-purple-500">
      <div className="text-center mb-10">
        <h1 className="text-5xl font-black bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600 bg-clip-text text-transparent italic">
          TICKETING DOJO
        </h1>
        <p className="text-gray-500 mt-2 tracking-widest uppercase text-xs">Master your clicking speed</p>
      </div>

      <div className="w-full max-w-lg bg-[#141414] border border-gray-800 rounded-3xl p-8 shadow-[0_0_50px_rgba(168,85,247,0.1)] relative overflow-hidden">
        {/* 난이도 배지 */}
        {step !== "HOME" && step !== "RESULT" && (
          <div className={`absolute top-4 right-6 font-bold text-xs px-3 py-1 rounded-full border ${config[difficulty].color} border-current`}>
            {config[difficulty].label} 모드
          </div>
        )}

        {step === "HOME" && (
          <div className="space-y-8">
            <div className="grid grid-cols-3 gap-3">
              {(["EASY", "NORMAL", "HARD"] as Difficulty[]).map((d) => (
                <button
                  key={d}
                  onClick={() => setDifficulty(d)}
                  className={`py-3 rounded-xl text-sm font-bold transition-all ${
                    difficulty === d 
                    ? "bg-purple-600 border-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.4)]" 
                    : "bg-gray-900 border-gray-800 text-gray-500 hover:text-gray-300"
                  } border`}
                >
                  {config[d].label}
                </button>
              ))}
            </div>
            
            <button
              onClick={startSimulator}
              className="w-full py-5 bg-gradient-to-r from-purple-600 to-pink-600 hover:scale-[1.02] rounded-2xl font-black text-2xl transition-all active:scale-95 shadow-lg"
            >
              입장 훈련 시작
            </button>

            {/* 랭킹 보드 */}
            <div className="mt-10 pt-8 border-t border-gray-800">
              <h3 className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
                <span className="w-1 h-1 bg-pink-500 rounded-full"></span> 실시간 명예의 전당
              </h3>
              <div className="space-y-3">
                {rankings.map((r, i) => (
                  <div key={i} className="flex justify-between items-center text-sm bg-black/40 p-3 rounded-lg border border-gray-900">
                    <div className="flex items-center gap-3">
                      <span className={`font-mono ${i === 0 ? "text-yellow-400" : "text-gray-600"}`}>0{i+1}</span>
                      <span className="font-medium">{r.name}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded border border-current ${config[r.difficulty].color} opacity-70`}>{config[r.difficulty].label}</span>
                    </div>
                    <span className="font-mono font-bold text-purple-400">{r.time.toFixed(2)}s</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === "WAITING" && (
          <div className="text-center py-10 space-y-8">
            <h2 className="text-xl font-bold text-gray-400">오픈까지 남은 시간</h2>
            <div className="text-8xl font-black text-white tracking-tighter tabular-nums drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]">
              {timeLeft.toFixed(1)}
            </div>
            <button
              onClick={enterHall}
              className={`w-full py-5 rounded-2xl font-black text-2xl transition-all ${
                timeLeft === 0
                  ? "bg-white text-black animate-pulse shadow-[0_0_30px_rgba(255,255,255,0.4)]"
                  : "bg-gray-800 text-gray-600 cursor-not-allowed"
              }`}
            >
              입장하기
            </button>
          </div>
        )}

        {step === "SEATING" && (
          <div className="space-y-4">
            <div className="flex justify-between items-end mb-2">
              <div>
                <h2 className="text-2xl font-black">좌석 선택</h2>
                <p className="text-xs text-gray-500">원하는 보라색 포도알을 클릭하세요!</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-gray-500 uppercase">남은 시간</p>
                <p className={`font-mono font-bold ${gameTimer > config[difficulty].limit - 5 ? "text-red-500 animate-ping" : "text-white"}`}>
                  {config[difficulty].limit - gameTimer}s
                </p>
              </div>
            </div>
            <div className={`grid grid-cols-10 gap-1.5 bg-black p-4 rounded-2xl border border-gray-800 transition-opacity ${isLagging ? "opacity-50 cursor-wait" : ""}`}>
              {seats.map((isAvailable, i) => (
                <div
                  key={i}
                  onClick={() => selectSeat(isAvailable)}
                  className={`aspect-square rounded-md cursor-pointer transition-all ${
                    isAvailable 
                      ? "bg-purple-600 hover:bg-pink-500 hover:scale-110 shadow-[0_0_10px_rgba(168,85,247,0.2)]" 
                      : "bg-gray-900 border border-gray-800"
                  }`}
                />
              ))}
            </div>
            {isLagging && <p className="text-center text-xs text-red-400 animate-pulse">서버 응답 지연 중... 잠시만 기다려주세요.</p>}
          </div>
        )}

        {step === "PAYMENT" && (
          <form onSubmit={completePayment} className="space-y-6 py-4">
            <div className="text-center">
              <h2 className="text-2xl font-black">결제 정보</h2>
              <p className="text-xs text-gray-500">최대한 빠르게 입력하고 결제하세요!</p>
            </div>
            <div className="space-y-4">
              <input required type="text" maxLength={6} placeholder="생년월일 (YYMMDD)" className="w-full bg-black border border-gray-800 rounded-xl p-4 outline-none focus:border-purple-500 transition-colors" />
              <input required type="text" placeholder="카드번호 (- 없이)" className="w-full bg-black border border-gray-800 rounded-xl p-4 outline-none focus:border-purple-500 transition-colors" />
            </div>
            <button type="submit" className="w-full py-5 bg-purple-600 hover:bg-purple-500 rounded-2xl font-black text-xl shadow-lg">
              결제 완료
            </button>
          </form>
        )}

        {step === "RESULT" && (
          <div className="text-center space-y-8 py-6">
            <div className="inline-block p-4 rounded-full bg-green-500/10 border border-green-500/20 mb-2">
              <span className="text-5xl">🎉</span>
            </div>
            <h2 className="text-4xl font-black text-white italic">SUCCESS!</h2>
            <div className="bg-black/50 rounded-3xl p-8 border border-gray-800 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-pink-500"></div>
              <p className="text-gray-500 text-xs uppercase tracking-[0.3em] mb-2">Final Time</p>
              <p className="text-6xl font-black text-white tracking-tighter">{elapsed.toFixed(3)}s</p>
              <p className="text-purple-400 font-bold mt-4 flex items-center justify-center gap-2">
                 {getRankEmoji(elapsed)}
              </p>
            </div>
            <button
              onClick={() => setStep("HOME")}
              className="w-full py-4 bg-gray-900 hover:bg-gray-800 rounded-2xl font-bold text-gray-300 transition-all border border-gray-800"
            >
              훈련장으로 돌아가기
            </button>
          </div>
        )}
      </div>

      <footer className="mt-16 text-center space-y-2">
        <p className="text-gray-700 text-[10px] uppercase tracking-widest font-bold">Powered by Next.js & Tailwind CSS</p>
        <div className="flex justify-center gap-4 text-gray-800">
           <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
           <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
           <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
        </div>
      </footer>
    </main>
  );
}
