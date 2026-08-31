'use client';

import React, { useState } from 'react';
import { useContent } from '../context/ContentContext';
import { useLanguage } from '../context/LanguageContext';
import { VisheshaDivasam, PradoshamDate, SamkramamDate } from '../types';
import {
  X,
  Calendar,
  Sparkles,
  Printer,
  Edit3,
  Plus,
  Trash2,
  Save,
  Check,
  RotateCcw,
  Eye,
  Clock,
  Building,
  Flame,
  ArrowLeft,
  ChevronRight,
} from 'lucide-react';

interface AnnualCalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  isAdmin?: boolean;
  initialMode?: 'poster' | 'edit';
}

export const AnnualCalendarModal: React.FC<AnnualCalendarModalProps> = ({
  isOpen,
  onClose,
  isAdmin = false,
  initialMode = 'poster',
}) => {
  const {
    annualCalendar,
    updateAnnualCalendar,
    addVisheshaDivasam,
    updateVisheshaDivasam,
    deleteVisheshaDivasam,
    addPradoshamDate,
    updatePradoshamDate,
    deletePradoshamDate,
    addSamkramamDate,
    updateSamkramamDate,
    deleteSamkramamDate,
    updateUlsavamBox,
    resetAnnualCalendar,
  } = useContent();

  const { language } = useLanguage();
  const [activeView, setActiveView] = useState<'poster' | 'edit'>(initialMode);

  React.useEffect(() => {
    if (isOpen) {
      setActiveView(initialMode);
    }
  }, [isOpen, initialMode]);
  const [activeEditTab, setActiveEditTab] = useState<'vishesham' | 'pradosham' | 'samkramam' | 'general'>('vishesham');

  // Form states for adding new rows
  const [newVd, setNewVd] = useState<Omit<VisheshaDivasam, 'id'>>({
    malayalamMonthDate: '',
    englishMonthDate: '',
    dayOfWeek: 'തിങ്കൾ',
    vishesham: '',
  });

  const [newPd, setNewPd] = useState<Omit<PradoshamDate, 'id'>>({
    malayalamMonthDate: '',
    englishMonthDate: '',
    dayOfWeek: 'ചൊവ്വ',
  });

  const [newSk, setNewSk] = useState<Omit<SamkramamDate, 'id'>>({
    malayalamMonth: '',
    occurringMonthDate: '',
    dayOfWeek: '1 തിങ്കൾ',
  });

  // General header form state
  const [generalForm, setGeneralForm] = useState({
    malayalamYear: annualCalendar.malayalamYear,
    gregorianYear: annualCalendar.gregorianYear,
    title: annualCalendar.title,
    ulsavamTitle: annualCalendar.ulsavamBox.title,
    ulsavamGregorian: annualCalendar.ulsavamBox.gregorianDates,
    ulsavamMalayalam: annualCalendar.ulsavamBox.malayalamDates,
    poojaMorning: annualCalendar.poojaTimings.morning,
    poojaEvening: annualCalendar.poojaTimings.evening,
  });

  if (!isOpen) return null;

  const handlePrint = () => {
    const printWindow = window.open('', '_blank', 'width=900,height=1100');
    if (!printWindow) {
      window.print();
      return;
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="ml">
      <head>
        <meta charset="UTF-8">
        <title>${annualCalendar.templeName} - ${annualCalendar.malayalamYear} ${annualCalendar.gregorianYear}</title>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@700;800;900&family=Gayathri:wght@700;900&family=Manjari:wght@400;700&display=swap" rel="stylesheet">
        <style>
          @page {
            size: A4 portrait;
            margin: 3.5mm 4.5mm;
          }
          * {
            box-sizing: border-box;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          html, body {
            font-family: 'Manjari', sans-serif;
            background: #FAF5E8;
            color: #1A0409;
            margin: 0;
            padding: 0;
            width: 100%;
            height: 100%;
            -webkit-font-smoothing: antialiased;
          }
          .poster-container {
            width: 100%;
            background: #FAF5E8;
            border: 2px solid #1A365D;
            border-radius: 6px;
            padding: 5px 6px;
          }
          .poster-header {
            text-align: center;
            border-bottom: 2px solid #1A365D;
            padding-bottom: 3px;
            margin-bottom: 4px;
            background: linear-gradient(to right, rgba(0,51,102,0.08), rgba(250,245,232,1), rgba(0,51,102,0.08));
            border-radius: 4px;
          }
          .sacred-emblem {
            font-size: 10px;
            font-weight: 800;
            color: #8C6219;
            font-family: 'Cinzel', serif;
            letter-spacing: 1.5px;
            margin-bottom: 1px;
          }
          .temple-title {
            font-family: 'Gayathri', sans-serif;
            font-size: 24px;
            font-weight: 900;
            color: #990000;
            margin: 0;
            line-height: 1.05;
          }
          .temple-sub {
            font-size: 10.5px;
            font-weight: 700;
            margin: 1px 0 0 0;
            color: #1A0409;
          }
          .temple-phone {
            font-size: 10px;
            font-weight: 800;
            font-family: monospace;
            color: #003366;
            margin: 1px 0 0 0;
          }
          .year-banner {
            margin-top: 3px;
            padding-top: 2px;
            border-top: 1px solid rgba(0,51,102,0.2);
          }
          .year-title {
            font-family: 'Gayathri', sans-serif;
            font-size: 18px;
            font-weight: 900;
            color: #CC0000;
            margin: 0;
            line-height: 1.05;
          }
          .section-title {
            font-family: 'Gayathri', sans-serif;
            font-size: 14px;
            font-weight: 900;
            color: #990000;
            margin: 1px 0 0 0;
          }
          .grid-columns {
            display: grid;
            grid-template-columns: 42% 31% 27%;
            gap: 4px;
            align-items: start;
          }
          .col-card {
            background: #ffffff;
            border: 1px solid #003366;
            border-radius: 5px;
            overflow: hidden;
          }
          .col-header {
            background: #002244;
            color: #ffffff;
            text-align: center;
            font-size: 10.5px;
            font-weight: 800;
            padding: 2.5px 2px;
            font-family: 'Gayathri', sans-serif;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            font-size: 8px;
          }
          thead tr {
            background: #E60000;
            color: #ffffff;
            font-weight: 800;
            font-size: 7.5px;
          }
          th {
            padding: 1px 1.5px;
            text-align: center;
            border: 0.5px solid rgba(255,255,255,0.3);
          }
          td {
            padding: 1px 1.5px;
            border-bottom: 0.5px solid #E4D5AE;
            line-height: 1.1;
          }
          tr:nth-child(even) {
            background: #FFF9EE;
          }
          .text-center { text-align: center; }
          .text-left { text-align: left; }
          .nowrap { white-space: nowrap; }
          .font-bold { font-weight: 700; }
          .text-navy { color: #002244; }
          .text-maroon { color: #610C1B; }
          .text-red { color: #990000; }
          .pooja-card {
            background: #1F4E34;
            color: #ffffff;
            border-radius: 5px;
            padding: 3px 4px;
            text-align: center;
            border: 1.5px solid #C99738;
            margin-top: 3px;
          }
          .pooja-title {
            color: #E6BE65;
            font-weight: 800;
            font-size: 9px;
            margin-bottom: 1px;
            font-family: 'Gayathri', sans-serif;
          }
          .pooja-text {
            font-size: 7.5px;
            font-weight: 700;
            margin: 0;
            line-height: 1.15;
          }
          .bank-card {
            background: #E8F4FD;
            border: 1px solid #003366;
            border-radius: 5px;
            padding: 2.5px 3px;
            margin-top: 3px;
            font-size: 7px;
          }
          .bank-flex {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 2px;
          }
          .bank-qr {
            width: 26px;
            height: 26px;
            border: 0.5px solid #003366;
            background: #fff;
            padding: 1px;
          }
          .ulsavam-banner {
            margin-top: 4px;
            background: linear-gradient(to right, #800000, #A00000, #800000);
            color: #ffffff;
            border-radius: 5px;
            padding: 4px 6px;
            text-align: center;
            border: 1.5px solid #E6BE65;
          }
          .ulsavam-title {
            font-family: 'Gayathri', sans-serif;
            font-size: 15px;
            font-weight: 900;
            color: #FFD700;
            margin: 0;
            line-height: 1.05;
          }
          .ulsavam-dates {
            font-size: 10px;
            font-weight: 800;
            margin: 1px 0 0 0;
            color: #ffffff;
          }
          .ulsavam-mal {
            font-size: 9.5px;
            font-weight: 800;
            margin: 1px 0 0 0;
            color: #FFD700;
          }
          .ulsavam-footer {
            font-size: 7.5px;
            color: rgba(255,255,255,0.8);
            font-style: italic;
            margin: 2px 0 0 0;
          }
        </style>
      </head>
      <body>
        <div class="poster-container">
          <div class="poster-header">
            <div class="sacred-emblem">ॐ SREE MAHADEVA TEMPLE · PULIYANNOOR ॐ</div>
            <h1 class="temple-title">${annualCalendar.templeName}</h1>
            <p class="temple-sub">${annualCalendar.templeAddress}</p>
            <p class="temple-phone">മൊബൈൽ : ${annualCalendar.templePhones}</p>
            <div class="year-banner">
              <h2 class="year-title">${annualCalendar.malayalamYear} ${annualCalendar.gregorianYear}</h2>
              <h3 class="section-title">${annualCalendar.title}</h3>
            </div>
          </div>

          <div class="grid-columns">
            <!-- Col 1: Vishesham -->
            <div class="col-card">
              <div class="col-header">പ്രധാന വിശേഷ ദിവസങ്ങൾ</div>
              <table>
                <thead>
                  <tr>
                    <th>മലയാളം</th>
                    <th>ഇംഗ്ലീഷ്</th>
                    <th>ദിവസം</th>
                    <th class="text-left">വിശേഷം</th>
                  </tr>
                </thead>
                <tbody>
                  ${annualCalendar.visheshaDivasangal.map(r => `
                    <tr>
                      <td class="text-center nowrap font-bold text-navy">${r.malayalamMonthDate}</td>
                      <td class="text-center nowrap font-bold text-maroon">${r.englishMonthDate}</td>
                      <td class="text-center nowrap">${r.dayOfWeek}</td>
                      <td class="text-left font-bold text-red">${r.vishesham}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>

            <!-- Col 2: Pradosham -->
            <div class="col-card">
              <div class="col-header">പ്രദോഷം</div>
              <table>
                <thead>
                  <tr>
                    <th>മലയാളം</th>
                    <th>ഇംഗ്ലീഷ്</th>
                    <th>ദിവസം</th>
                  </tr>
                </thead>
                <tbody>
                  ${annualCalendar.pradosham.map(r => `
                    <tr>
                      <td class="text-center nowrap font-bold text-navy">${r.malayalamMonthDate}</td>
                      <td class="text-center nowrap font-bold text-maroon">${r.englishMonthDate}</td>
                      <td class="text-center nowrap">${r.dayOfWeek}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>

            <!-- Col 3: Samkramam + Pooja + Bank -->
            <div>
              <div class="col-card">
                <div class="col-header">സംക്രമം</div>
                <table>
                  <thead>
                    <tr>
                      <th>മാസം</th>
                      <th>തീയതി</th>
                      <th>ദിവസം</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${annualCalendar.samkramam.map(r => `
                      <tr>
                        <td class="text-center nowrap font-bold text-navy">${r.malayalamMonth}</td>
                        <td class="text-center nowrap font-bold text-maroon">${r.occurringMonthDate}</td>
                        <td class="text-center nowrap">${r.dayOfWeek}</td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              </div>

              <!-- Pooja Timings -->
              <div class="pooja-card">
                <div class="pooja-title">പൂജാസമയം</div>
                <p class="pooja-text">${annualCalendar.poojaTimings.morning}</p>
                <p class="pooja-text">${annualCalendar.poojaTimings.evening}</p>
              </div>

              <!-- Bank Info -->
              <div class="bank-card">
                <div class="bank-flex">
                  <div>
                    <strong style="color:#002244; font-size:7.5px; text-transform:uppercase;">${annualCalendar.bankInfo.bankName}</strong><br/>
                    <span style="color:#5A382A; font-size:6.5px;">${annualCalendar.bankInfo.branch}</span>
                  </div>
                  <img src="/temple-qr-code.png" class="bank-qr" alt="QR" />
                </div>
                <div style="margin-top:2px; padding-top:2px; border-top:0.5px solid rgba(0,51,102,0.2); line-height: 1.1;">
                  <span><strong>A/c:</strong> ${annualCalendar.bankInfo.accountNo}</span><br/>
                  <span><strong>IFSC:</strong> ${annualCalendar.bankInfo.ifsc}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Bottom Ulsavam Banner -->
          <div class="ulsavam-banner">
            <h3 class="ulsavam-title">${annualCalendar.ulsavamBox.title}</h3>
            <p class="ulsavam-dates">${annualCalendar.ulsavamBox.gregorianDates}</p>
            <p class="ulsavam-mal">${annualCalendar.ulsavamBox.malayalamDates}</p>
            <p class="ulsavam-footer">${annualCalendar.ulsavamBox.footerNote}</p>
          </div>
        </div>

        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
            }, 250);
          };
        </script>
      </body>
      </html>
    `;

    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  const handleSaveGeneral = (e: React.FormEvent) => {
    e.preventDefault();
    updateAnnualCalendar({
      malayalamYear: generalForm.malayalamYear,
      gregorianYear: generalForm.gregorianYear,
      title: generalForm.title,
      poojaTimings: {
        morning: generalForm.poojaMorning,
        evening: generalForm.poojaEvening,
      },
    });
    updateUlsavamBox({
      title: generalForm.ulsavamTitle,
      gregorianDates: generalForm.ulsavamGregorian,
      malayalamDates: generalForm.ulsavamMalayalam,
    });
    alert('General details updated successfully!');
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#1A0409]/85 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-[#FAF5E8] rounded-3xl max-w-5xl w-full shadow-2xl border-2 border-[#C99738] flex flex-col max-h-[94vh] overflow-hidden animate-scaleUp">
        {/* Modal Top Bar */}
        <div className="p-4 bg-gradient-to-r from-[#610C1B] via-[#8B1428] to-[#610C1B] text-white flex items-center justify-between flex-shrink-0 border-b border-[#C99738]/40 shadow-sm">
          <div className="flex items-center gap-2.5">
            <Calendar className="w-5 h-5 text-[#E6BE65]" />
            <div>
              <h3 className="font-cinzel font-bold text-sm sm:text-base text-[#FAF5E8]">
                {annualCalendar.templeName} — {annualCalendar.malayalamYear} {annualCalendar.gregorianYear}
              </h3>
              <p className="text-[11px] text-[#E6BE65] font-medium hidden sm:block">
                Annual Malayalam Temple Calendar & Special Days Publication
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAdmin && (
              <button
                onClick={() => setActiveView(activeView === 'poster' ? 'edit' : 'poster')}
                className="px-3 py-1.5 rounded-xl bg-[#FAF5E8] text-[#610C1B] hover:bg-[#E4D5AE] text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              >
                {activeView === 'poster' ? (
                  <>
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit Calendar</span>
                  </>
                ) : (
                  <>
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Letterpad</span>
                  </>
                )}
              </button>
            )}

            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-xl bg-[#C99738]/30 hover:bg-[#C99738]/50 text-[#FAF5E8] border border-[#E6BE65]/40 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Print Calendar Letterpad"
            >
              <Printer className="w-3.5 h-3.5 text-[#E6BE65]" />
              <span className="hidden sm:inline">Print / PDF</span>
            </button>

            <button
              onClick={onClose}
              className="text-[#FAF5E8]/80 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body Container */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-6 bg-[#FAF5E8]">
          {activeView === 'poster' ? (
            /* ------------------------------------------------------------- */
            /* 1. LETTERPAD / POSTER VIEW (Traditional Devaswom Notice)     */
            /* ------------------------------------------------------------- */
            <div className="max-w-4xl mx-auto bg-gradient-to-b from-[#87CEEB]/20 via-[#FAF5E8] to-[#FFF9EE] p-4 sm:p-6 rounded-2xl border-2 border-[#1A365D]/30 shadow-lg text-[#1A0409]">
              {/* Clean Letterpad Header (Centered, Authentic Kerala Temple Notice Style) */}
              <div className="relative rounded-2xl overflow-hidden mb-5 border-b-2 border-[#1A365D]/30 pb-5 bg-gradient-to-r from-[#003366]/10 via-[#FAF5E8] to-[#003366]/10 p-4 text-center">
                {/* Traditional Sacred Emblem */}
                <div className="inline-flex items-center justify-center gap-2 mb-1.5">
                  <span className="text-xl text-[#C99738] select-none font-serif">ॐ</span>
                  <span className="text-[11px] font-bold text-[#8C6219] uppercase tracking-widest font-cinzel">
                    SREE MAHADEVA TEMPLE · PULIYANNOOR
                  </span>
                  <span className="text-xl text-[#C99738] select-none font-serif">ॐ</span>
                </div>

                {/* Primary Temple Title in Malayalam */}
                <h1 className="font-malayalam-heading font-extrabold text-2xl sm:text-3xl md:text-4xl text-[#990000] tracking-wide drop-shadow-xs">
                  {annualCalendar.templeName}
                </h1>
                <p className="text-xs sm:text-sm font-semibold text-[#1A0409] mt-1">
                  {annualCalendar.templeAddress}
                </p>
                <p className="text-xs font-mono font-bold text-[#003366] mt-0.5">
                  മൊബൈൽ : {annualCalendar.templePhones}
                </p>

                {/* Year & Main Notice Title */}
                <div className="mt-3.5 pt-3 border-t border-[#003366]/15 inline-block w-full max-w-2xl">
                  <h2 className="font-malayalam-heading font-extrabold text-xl sm:text-2xl md:text-3xl text-[#CC0000] tracking-wider">
                    {annualCalendar.malayalamYear} {annualCalendar.gregorianYear}
                  </h2>
                  <h3 className="font-malayalam-heading font-bold text-base sm:text-xl md:text-2xl text-[#990000] mt-1">
                    {annualCalendar.title}
                  </h3>
                </div>
              </div>

              {/* 3 Parallel Columns Grid with Semantic Tables */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 items-start">
                {/* --------------------------------------------------------- */}
                {/* COLUMN 1: പ്രധാന വിശേഷ ദിവസങ്ങൾ (Vishesha Divasangal)     */}
                {/* --------------------------------------------------------- */}
                <div className="lg:col-span-5 bg-white rounded-xl border border-[#003366]/40 shadow-xs overflow-hidden">
                  <div className="bg-[#002244] text-white text-center py-2 px-3 font-malayalam-heading font-bold text-xs sm:text-sm tracking-wide">
                    പ്രധാന വിശേഷ ദിവസങ്ങൾ
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-[10px] sm:text-[11px] border-collapse">
                      <thead>
                        <tr className="bg-[#E60000] text-white text-[10px] sm:text-[11px] font-bold">
                          <th className="py-1 px-1.5 text-center font-bold">മലയാളം</th>
                          <th className="py-1 px-1.5 text-center font-bold">ഇംഗ്ലീഷ്</th>
                          <th className="py-1 px-1 text-center font-bold">ദിവസം</th>
                          <th className="py-1 px-2 text-left font-bold">വിശേഷം</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#E4D5AE]/70 font-medium">
                        {annualCalendar.visheshaDivasangal.map((row, idx) => (
                          <tr
                            key={row.id || idx}
                            className={idx % 2 === 0 ? 'bg-white' : 'bg-[#FFF9EE]'}
                          >
                            <td className="py-1.5 px-1.5 font-bold text-[#002244] font-malayalam-sans text-center whitespace-nowrap">
                              {row.malayalamMonthDate}
                            </td>
                            <td className="py-1.5 px-1.5 font-semibold text-[#610C1B] text-center whitespace-nowrap">
                              {row.englishMonthDate}
                            </td>
                            <td className="py-1.5 px-1 text-center text-[#1A0409] whitespace-nowrap">
                              {row.dayOfWeek}
                            </td>
                            <td className="py-1.5 px-2 font-bold text-[#990000] leading-tight text-left">
                              {row.vishesham}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* --------------------------------------------------------- */}
                {/* COLUMN 2: പ്രദോഷം (Pradosham)                            */}
                {/* --------------------------------------------------------- */}
                <div className="lg:col-span-4 bg-white rounded-xl border border-[#003366]/40 shadow-xs overflow-hidden">
                  <div className="bg-[#002244] text-white text-center py-2 px-3 font-malayalam-heading font-bold text-xs sm:text-sm tracking-wide">
                    പ്രദോഷം
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-[10px] sm:text-[11px] border-collapse">
                      <thead>
                        <tr className="bg-[#E60000] text-white text-[10px] sm:text-[11px] font-bold">
                          <th className="py-1 px-1.5 text-center font-bold">മലയാളം</th>
                          <th className="py-1 px-1.5 text-center font-bold">ഇംഗ്ലീഷ്</th>
                          <th className="py-1 px-1.5 text-center font-bold">ദിവസം</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#E4D5AE]/70 font-medium">
                        {annualCalendar.pradosham.map((row, idx) => (
                          <tr
                            key={row.id || idx}
                            className={idx % 2 === 0 ? 'bg-white' : 'bg-[#FFF9EE]'}
                          >
                            <td className="py-1.5 px-1.5 font-bold text-[#002244] font-malayalam-sans text-center whitespace-nowrap">
                              {row.malayalamMonthDate}
                            </td>
                            <td className="py-1.5 px-1.5 font-semibold text-[#610C1B] text-center whitespace-nowrap">
                              {row.englishMonthDate}
                            </td>
                            <td className="py-1.5 px-1.5 text-center text-[#1A0409] whitespace-nowrap">
                              {row.dayOfWeek}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* --------------------------------------------------------- */}
                {/* COLUMN 3: സംക്രമം (Samkramam) + Timings & Bank Info      */}
                {/* --------------------------------------------------------- */}
                <div className="lg:col-span-3 space-y-3">
                  {/* Samkramam Semantic Table Card */}
                  <div className="bg-white rounded-xl border border-[#003366]/40 shadow-xs overflow-hidden">
                    <div className="bg-[#002244] text-white text-center py-2 px-3 font-malayalam-heading font-bold text-xs sm:text-sm tracking-wide">
                      സംക്രമം
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-[10px] sm:text-[11px] border-collapse">
                        <thead>
                          <tr className="bg-[#E60000] text-white text-[10px] font-bold">
                            <th className="py-1 px-1.5 text-center font-bold">മാസം</th>
                            <th className="py-1 px-1.5 text-center font-bold">തീയതി</th>
                            <th className="py-1 px-1.5 text-center font-bold">ദിവസം</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E4D5AE]/70 font-medium">
                          {annualCalendar.samkramam.map((row, idx) => (
                            <tr
                              key={row.id || idx}
                              className={idx % 2 === 0 ? 'bg-white' : 'bg-[#FFF9EE]'}
                            >
                              <td className="py-1.5 px-1.5 font-bold text-[#002244] text-center whitespace-nowrap">
                                {row.malayalamMonth}
                              </td>
                              <td className="py-1.5 px-1.5 text-center font-semibold text-[#610C1B] whitespace-nowrap">
                                {row.occurringMonthDate}
                              </td>
                              <td className="py-1.5 px-1.5 text-center text-[#1A0409] whitespace-nowrap">
                                {row.dayOfWeek}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Pooja Timings Box */}
                  <div className="bg-[#1F4E34] text-white rounded-xl p-3 text-center border-2 border-[#C99738] shadow-sm">
                    <h4 className="font-malayalam-heading font-bold text-xs text-[#E6BE65] mb-1">
                      പൂജാസമയം
                    </h4>
                    <p className="text-[11px] font-semibold">{annualCalendar.poojaTimings.morning}</p>
                    <p className="text-[11px] font-semibold mt-0.5">{annualCalendar.poojaTimings.evening}</p>
                  </div>

                  {/* Canara Bank Info Card with QR */}
                  <div className="bg-[#E8F4FD] rounded-xl p-2.5 border border-[#003366]/40 text-center shadow-xs">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <div className="text-left">
                        <span className="font-bold text-[10px] text-[#002244] uppercase block">
                          {annualCalendar.bankInfo.bankName}
                        </span>
                        <span className="text-[9px] text-[#5A382A] font-medium block">
                          {annualCalendar.bankInfo.branch}
                        </span>
                      </div>
                      <div className="w-8 h-8 bg-white p-0.5 rounded border border-[#003366] flex-shrink-0">
                        <img src="/temple-qr-code.png" alt="UPI QR" className="w-full h-full object-contain" />
                      </div>
                    </div>
                    <div className="text-[9px] text-left text-[#002244] border-t border-[#003366]/20 pt-1">
                      <p><strong>A/c:</strong> {annualCalendar.bankInfo.accountNo}</p>
                      <p><strong>IFSC:</strong> {annualCalendar.bankInfo.ifsc}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* ------------------------------------------------------------- */}
              {/* Bottom Special Highlight Box: തിരുവുത്സവം (Ulsavam Dates)    */}
              {/* ------------------------------------------------------------- */}
              <div className="mt-4 rounded-2xl bg-gradient-to-r from-[#800000] via-[#A00000] to-[#800000] text-white p-4 sm:p-5 text-center border-2 border-[#E6BE65] shadow-md">
                <h3 className="font-malayalam-heading font-extrabold text-xl sm:text-2xl md:text-3xl text-[#FFD700] tracking-wider drop-shadow-sm">
                  {annualCalendar.ulsavamBox.title}
                </h3>
                <p className="font-malayalam-sans font-bold text-sm sm:text-base md:text-lg text-white mt-1">
                  {annualCalendar.ulsavamBox.gregorianDates}
                </p>
                <p className="font-malayalam-sans font-extrabold text-sm sm:text-base text-[#FFD700] mt-0.5">
                  {annualCalendar.ulsavamBox.malayalamDates}
                </p>
                <p className="text-[10px] text-white/75 italic mt-2 font-medium">
                  {annualCalendar.ulsavamBox.footerNote}
                </p>
              </div>
            </div>
          ) : (
            /* ------------------------------------------------------------- */
            /* 2. ADMIN EDITOR MODE (Add, Edit, Remove rows in 3 sections)  */
            /* ------------------------------------------------------------- */
            <div className="space-y-4">
              {/* Editor Subtabs Navigation */}
              <div className="flex flex-wrap gap-2 border-b border-[#E4D5AE] pb-3">
                <button
                  onClick={() => setActiveEditTab('vishesham')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                    activeEditTab === 'vishesham'
                      ? 'bg-[#610C1B] text-white shadow-xs'
                      : 'bg-white text-[#38050E] border border-[#E4D5AE] hover:bg-[#FAF5E8]'
                  }`}
                >
                  <span>1. പ്രധാന വിശേഷങ്ങൾ ({annualCalendar.visheshaDivasangal.length})</span>
                </button>

                <button
                  onClick={() => setActiveEditTab('pradosham')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                    activeEditTab === 'pradosham'
                      ? 'bg-[#610C1B] text-white shadow-xs'
                      : 'bg-white text-[#38050E] border border-[#E4D5AE] hover:bg-[#FAF5E8]'
                  }`}
                >
                  <span>2. പ്രദോഷം ({annualCalendar.pradosham.length})</span>
                </button>

                <button
                  onClick={() => setActiveEditTab('samkramam')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                    activeEditTab === 'samkramam'
                      ? 'bg-[#610C1B] text-white shadow-xs'
                      : 'bg-white text-[#38050E] border border-[#E4D5AE] hover:bg-[#FAF5E8]'
                  }`}
                >
                  <span>3. സംക്രമം ({annualCalendar.samkramam.length})</span>
                </button>

                <button
                  onClick={() => setActiveEditTab('general')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                    activeEditTab === 'general'
                      ? 'bg-[#610C1B] text-white shadow-xs'
                      : 'bg-white text-[#38050E] border border-[#E4D5AE] hover:bg-[#FAF5E8]'
                  }`}
                >
                  <span>4. Year & Ulsavam Dates</span>
                </button>
              </div>

              {/* TAB 1: EDIT VISHESHA DIVASANGAL */}
              {activeEditTab === 'vishesham' && (
                <div className="space-y-4">
                  {/* Add New Vishesham Form */}
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (!newVd.malayalamMonthDate || !newVd.englishMonthDate || !newVd.vishesham) {
                        alert('Please fill in all Vishesham fields');
                        return;
                      }
                      addVisheshaDivasam(newVd);
                      setNewVd({
                        malayalamMonthDate: '',
                        englishMonthDate: '',
                        dayOfWeek: 'തിങ്കൾ',
                        vishesham: '',
                      });
                    }}
                    className="p-4 bg-white rounded-2xl border border-[#E4D5AE] shadow-xs space-y-3"
                  >
                    <span className="font-cinzel font-bold text-xs text-[#610C1B] uppercase tracking-wider block">
                      + Add New Special Day (വിശേഷ ദിവസം)
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
                      <div>
                        <label className="block text-[11px] font-bold text-[#8C6219] mb-1">Malayalam Date *</label>
                        <input
                          type="text"
                          placeholder="e.g. 1202 ചിങ്ങം 1 or 10"
                          value={newVd.malayalamMonthDate}
                          onChange={(e) => setNewVd({ ...newVd, malayalamMonthDate: e.target.value })}
                          required
                          className="w-full px-3 py-1.5 rounded-lg border border-[#E4D5AE] text-xs"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-[#8C6219] mb-1">English Date *</label>
                        <input
                          type="text"
                          placeholder="e.g. 2026 ആഗസ്റ്റ് 17 or 26"
                          value={newVd.englishMonthDate}
                          onChange={(e) => setNewVd({ ...newVd, englishMonthDate: e.target.value })}
                          required
                          className="w-full px-3 py-1.5 rounded-lg border border-[#E4D5AE] text-xs"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-[#8C6219] mb-1">Day of Week *</label>
                        <input
                          type="text"
                          placeholder="e.g. തിങ്കൾ, ബുധൻ"
                          value={newVd.dayOfWeek}
                          onChange={(e) => setNewVd({ ...newVd, dayOfWeek: e.target.value })}
                          required
                          className="w-full px-3 py-1.5 rounded-lg border border-[#E4D5AE] text-xs"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-[#8C6219] mb-1">Vishesham Occasion *</label>
                        <input
                          type="text"
                          placeholder="e.g. ആണ്ടുപിറപ്പ്"
                          value={newVd.vishesham}
                          onChange={(e) => setNewVd({ ...newVd, vishesham: e.target.value })}
                          required
                          className="w-full px-3 py-1.5 rounded-lg border border-[#E4D5AE] text-xs"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="px-4 py-1.5 rounded-xl bg-[#610C1B] text-white text-xs font-bold flex items-center gap-1.5 hover:bg-[#8B1428]"
                      >
                        <Plus className="w-3.5 h-3.5 text-[#E6BE65]" />
                        <span>Add Row</span>
                      </button>
                    </div>
                  </form>

                  {/* List of Vishesha Divasangal with Inline Edit & Delete */}
                  <div className="bg-white rounded-2xl border border-[#E4D5AE] shadow-xs overflow-hidden">
                    <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-[#FAF5E8] border-b border-[#E4D5AE] font-bold text-[11px] text-[#8C6219]">
                      <span className="w-6 text-center font-mono">#</span>
                      <span className="w-32">മലയാളം (Mal Date)</span>
                      <span className="w-36">ഇംഗ്ലീഷ് (Eng Date)</span>
                      <span className="w-24 text-center">ദിവസം (Day)</span>
                      <span className="flex-1">വിശേഷം (Occasion / Festival)</span>
                      <span className="w-8 text-center">Action</span>
                    </div>

                    <div className="max-h-96 overflow-y-auto divide-y divide-[#E4D5AE]/60 p-2 space-y-2">
                      {annualCalendar.visheshaDivasangal.map((row, idx) => (
                        <div key={row.id} className="flex flex-col sm:flex-row items-center gap-2 p-2 rounded-xl bg-[#FAF5E8]/40 border border-[#E4D5AE]">
                          <span className="text-xs font-bold text-[#8C6219] w-6 text-center font-mono">
                            {idx + 1}.
                          </span>
                          <input
                            type="text"
                            value={row.malayalamMonthDate}
                            onChange={(e) => updateVisheshaDivasam(row.id, { malayalamMonthDate: e.target.value })}
                            className="w-full sm:w-32 px-2.5 py-1 rounded-lg border border-[#E4D5AE] bg-white text-xs font-bold text-[#38050E]"
                          />
                          <input
                            type="text"
                            value={row.englishMonthDate}
                            onChange={(e) => updateVisheshaDivasam(row.id, { englishMonthDate: e.target.value })}
                            className="w-full sm:w-36 px-2.5 py-1 rounded-lg border border-[#E4D5AE] bg-white text-xs font-semibold text-[#610C1B]"
                          />
                          <input
                            type="text"
                            value={row.dayOfWeek}
                            onChange={(e) => updateVisheshaDivasam(row.id, { dayOfWeek: e.target.value })}
                            className="w-full sm:w-24 px-2.5 py-1 rounded-lg border border-[#E4D5AE] bg-white text-xs text-center text-[#2B150F]"
                          />
                          <input
                            type="text"
                            value={row.vishesham}
                            onChange={(e) => updateVisheshaDivasam(row.id, { vishesham: e.target.value })}
                            className="w-full sm:flex-1 px-2.5 py-1 rounded-lg border border-[#E4D5AE] bg-white text-xs font-bold text-[#990000]"
                          />
                          <button
                            type="button"
                            onClick={() => deleteVisheshaDivasam(row.id)}
                            className="p-1.5 text-rose-700 hover:bg-rose-100 rounded-lg cursor-pointer transition-colors"
                            title="Delete row"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: EDIT PRADOSHAM */}
              {activeEditTab === 'pradosham' && (
                <div className="space-y-4">
                  {/* Add New Pradosham Form */}
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (!newPd.malayalamMonthDate || !newPd.englishMonthDate) {
                        alert('Please fill in Pradosham fields');
                        return;
                      }
                      addPradoshamDate(newPd);
                      setNewPd({
                        malayalamMonthDate: '',
                        englishMonthDate: '',
                        dayOfWeek: 'ചൊവ്വ',
                      });
                    }}
                    className="p-4 bg-white rounded-2xl border border-[#E4D5AE] shadow-xs space-y-3"
                  >
                    <span className="font-cinzel font-bold text-xs text-[#610C1B] uppercase tracking-wider block">
                      + Add New Pradosham Date (പ്രദോഷം)
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      <div>
                        <label className="block text-[11px] font-bold text-[#8C6219] mb-1">Malayalam Date *</label>
                        <input
                          type="text"
                          placeholder="e.g. 1202 ചിങ്ങം 9 or 23"
                          value={newPd.malayalamMonthDate}
                          onChange={(e) => setNewPd({ ...newPd, malayalamMonthDate: e.target.value })}
                          required
                          className="w-full px-3 py-1.5 rounded-lg border border-[#E4D5AE] text-xs"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-[#8C6219] mb-1">English Date *</label>
                        <input
                          type="text"
                          placeholder="e.g. 2026 ആഗസ്റ്റ് 25 or സെപ്റ്റംബർ 8"
                          value={newPd.englishMonthDate}
                          onChange={(e) => setNewPd({ ...newPd, englishMonthDate: e.target.value })}
                          required
                          className="w-full px-3 py-1.5 rounded-lg border border-[#E4D5AE] text-xs"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-[#8C6219] mb-1">Day of Week *</label>
                        <input
                          type="text"
                          placeholder="e.g. ചൊവ്വ, വ്യാഴം"
                          value={newPd.dayOfWeek}
                          onChange={(e) => setNewPd({ ...newPd, dayOfWeek: e.target.value })}
                          required
                          className="w-full px-3 py-1.5 rounded-lg border border-[#E4D5AE] text-xs"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="px-4 py-1.5 rounded-xl bg-[#610C1B] text-white text-xs font-bold flex items-center gap-1.5 hover:bg-[#8B1428]"
                      >
                        <Plus className="w-3.5 h-3.5 text-[#E6BE65]" />
                        <span>Add Row</span>
                      </button>
                    </div>
                  </form>

                  {/* List of Pradosham Dates */}
                  <div className="bg-white rounded-2xl border border-[#E4D5AE] shadow-xs overflow-hidden">
                    <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-[#FAF5E8] border-b border-[#E4D5AE] font-bold text-[11px] text-[#8C6219]">
                      <span className="w-6 text-center font-mono">#</span>
                      <span className="w-44">മലയാളം (Mal Date)</span>
                      <span className="flex-1">ഇംഗ്ലീഷ് (Eng Date)</span>
                      <span className="w-32 text-center">ദിവസം (Day)</span>
                      <span className="w-8 text-center">Action</span>
                    </div>

                    <div className="max-h-96 overflow-y-auto divide-y divide-[#E4D5AE]/60 p-2 space-y-2">
                      {annualCalendar.pradosham.map((row, idx) => (
                        <div key={row.id} className="flex flex-col sm:flex-row items-center gap-2 p-2 rounded-xl bg-[#FAF5E8]/40 border border-[#E4D5AE]">
                          <span className="text-xs font-bold text-[#8C6219] w-6 text-center font-mono">
                            {idx + 1}.
                          </span>
                          <input
                            type="text"
                            value={row.malayalamMonthDate}
                            onChange={(e) => updatePradoshamDate(row.id, { malayalamMonthDate: e.target.value })}
                            className="w-full sm:w-44 px-2.5 py-1 rounded-lg border border-[#E4D5AE] bg-white text-xs font-bold text-[#38050E]"
                          />
                          <input
                            type="text"
                            value={row.englishMonthDate}
                            onChange={(e) => updatePradoshamDate(row.id, { englishMonthDate: e.target.value })}
                            className="w-full sm:flex-1 px-2.5 py-1 rounded-lg border border-[#E4D5AE] bg-white text-xs font-semibold text-[#610C1B]"
                          />
                          <input
                            type="text"
                            value={row.dayOfWeek}
                            onChange={(e) => updatePradoshamDate(row.id, { dayOfWeek: e.target.value })}
                            className="w-full sm:w-32 px-2.5 py-1 rounded-lg border border-[#E4D5AE] bg-white text-xs text-center text-[#2B150F]"
                          />
                          <button
                            type="button"
                            onClick={() => deletePradoshamDate(row.id)}
                            className="p-1.5 text-rose-700 hover:bg-rose-100 rounded-lg cursor-pointer transition-colors"
                            title="Delete row"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: EDIT SAMKRAMAM */}
              {activeEditTab === 'samkramam' && (
                <div className="space-y-4">
                  {/* Add New Samkramam Form */}
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (!newSk.malayalamMonth || !newSk.occurringMonthDate) {
                        alert('Please fill in Samkramam fields');
                        return;
                      }
                      addSamkramamDate(newSk);
                      setNewSk({
                        malayalamMonth: '',
                        occurringMonthDate: '',
                        dayOfWeek: '1 തിങ്കൾ',
                      });
                    }}
                    className="p-4 bg-white rounded-2xl border border-[#E4D5AE] shadow-xs space-y-3"
                  >
                    <span className="font-cinzel font-bold text-xs text-[#610C1B] uppercase tracking-wider block">
                      + Add New Samkramam Date (സംക്രമം)
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      <div>
                        <label className="block text-[11px] font-bold text-[#8C6219] mb-1">Samkramam Month *</label>
                        <input
                          type="text"
                          placeholder="e.g. 1202 ചിങ്ങം or കന്നി"
                          value={newSk.malayalamMonth}
                          onChange={(e) => setNewSk({ ...newSk, malayalamMonth: e.target.value })}
                          required
                          className="w-full px-3 py-1.5 rounded-lg border border-[#E4D5AE] text-xs"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-[#8C6219] mb-1">Occurring Month & Date *</label>
                        <input
                          type="text"
                          placeholder="e.g. 2026 ചിങ്ങം or കന്നി"
                          value={newSk.occurringMonthDate}
                          onChange={(e) => setNewSk({ ...newSk, occurringMonthDate: e.target.value })}
                          required
                          className="w-full px-3 py-1.5 rounded-lg border border-[#E4D5AE] text-xs"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-[#8C6219] mb-1">Day of Week / Date *</label>
                        <input
                          type="text"
                          placeholder="e.g. 1 തിങ്കൾ or 31 ശനി"
                          value={newSk.dayOfWeek}
                          onChange={(e) => setNewSk({ ...newSk, dayOfWeek: e.target.value })}
                          required
                          className="w-full px-3 py-1.5 rounded-lg border border-[#E4D5AE] text-xs"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="px-4 py-1.5 rounded-xl bg-[#610C1B] text-white text-xs font-bold flex items-center gap-1.5 hover:bg-[#8B1428]"
                      >
                        <Plus className="w-3.5 h-3.5 text-[#E6BE65]" />
                        <span>Add Row</span>
                      </button>
                    </div>
                  </form>

                  {/* List of Samkramam Dates */}
                  <div className="bg-white rounded-2xl border border-[#E4D5AE] shadow-xs overflow-hidden">
                    <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-[#FAF5E8] border-b border-[#E4D5AE] font-bold text-[11px] text-[#8C6219]">
                      <span className="w-6 text-center font-mono">#</span>
                      <span className="w-44">മാസം (Month)</span>
                      <span className="flex-1">തീയതി / സംക്രമ മാസം (Occurring Month)</span>
                      <span className="w-36 text-center">ദിവസം (Date & Day)</span>
                      <span className="w-8 text-center">Action</span>
                    </div>

                    <div className="max-h-96 overflow-y-auto divide-y divide-[#E4D5AE]/60 p-2 space-y-2">
                      {annualCalendar.samkramam.map((row, idx) => (
                        <div key={row.id} className="flex flex-col sm:flex-row items-center gap-2 p-2 rounded-xl bg-[#FAF5E8]/40 border border-[#E4D5AE]">
                          <span className="text-xs font-bold text-[#8C6219] w-6 text-center font-mono">
                            {idx + 1}.
                          </span>
                          <input
                            type="text"
                            value={row.malayalamMonth}
                            onChange={(e) => updateSamkramamDate(row.id, { malayalamMonth: e.target.value })}
                            className="w-full sm:w-44 px-2.5 py-1 rounded-lg border border-[#E4D5AE] bg-white text-xs font-bold text-[#002244]"
                          />
                          <input
                            type="text"
                            value={row.occurringMonthDate}
                            onChange={(e) => updateSamkramamDate(row.id, { occurringMonthDate: e.target.value })}
                            className="w-full sm:flex-1 px-2.5 py-1 rounded-lg border border-[#E4D5AE] bg-white text-xs font-semibold text-[#610C1B]"
                          />
                          <input
                            type="text"
                            value={row.dayOfWeek}
                            onChange={(e) => updateSamkramamDate(row.id, { dayOfWeek: e.target.value })}
                            className="w-full sm:w-36 px-2.5 py-1 rounded-lg border border-[#E4D5AE] bg-white text-xs text-center text-[#1A0409]"
                          />
                          <button
                            type="button"
                            onClick={() => deleteSamkramamDate(row.id)}
                            className="p-1.5 text-rose-700 hover:bg-rose-100 rounded-lg cursor-pointer transition-colors"
                            title="Delete row"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: EDIT GENERAL & ULSAWAM DATES */}
              {activeEditTab === 'general' && (
                <form onSubmit={handleSaveGeneral} className="p-5 bg-white rounded-2xl border border-[#E4D5AE] shadow-xs space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block font-bold text-[#8C6219] mb-1">Malayalam Year</label>
                      <input
                        type="text"
                        value={generalForm.malayalamYear}
                        onChange={(e) => setGeneralForm({ ...generalForm, malayalamYear: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-[#E4D5AE]"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-[#8C6219] mb-1">Gregorian Year (Bracket)</label>
                      <input
                        type="text"
                        value={generalForm.gregorianYear}
                        onChange={(e) => setGeneralForm({ ...generalForm, gregorianYear: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-[#E4D5AE]"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-[#8C6219] mb-1">Calendar Main Title</label>
                      <input
                        type="text"
                        value={generalForm.title}
                        onChange={(e) => setGeneralForm({ ...generalForm, title: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-[#E4D5AE]"
                      />
                    </div>
                  </div>

                  {/* Ulsavam Dates Box */}
                  <div className="p-4 rounded-xl bg-[#FAF5E8] border border-[#C99738]/50 space-y-3">
                    <span className="font-cinzel font-bold text-xs text-[#610C1B] block uppercase tracking-wider">
                      തിരുവുത്സവം Highlight Banner Dates
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block font-bold text-[#8C6219] mb-1">Festival Title</label>
                        <input
                          type="text"
                          value={generalForm.ulsavamTitle}
                          onChange={(e) => setGeneralForm({ ...generalForm, ulsavamTitle: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-[#E4D5AE] bg-white font-bold"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-[#8C6219] mb-1">Gregorian Dates Text</label>
                        <input
                          type="text"
                          value={generalForm.ulsavamGregorian}
                          onChange={(e) => setGeneralForm({ ...generalForm, ulsavamGregorian: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-[#E4D5AE] bg-white"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-[#8C6219] mb-1">Malayalam Dates Text (Bracketed)</label>
                        <input
                          type="text"
                          value={generalForm.ulsavamMalayalam}
                          onChange={(e) => setGeneralForm({ ...generalForm, ulsavamMalayalam: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-[#E4D5AE] bg-white"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Pooja Timings */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-[#8C6219] mb-1">Morning Pooja Timings</label>
                      <input
                        type="text"
                        value={generalForm.poojaMorning}
                        onChange={(e) => setGeneralForm({ ...generalForm, poojaMorning: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-[#E4D5AE]"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-[#8C6219] mb-1">Evening Pooja Timings</label>
                      <input
                        type="text"
                        value={generalForm.poojaEvening}
                        onChange={(e) => setGeneralForm({ ...generalForm, poojaEvening: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-[#E4D5AE]"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-[#E4D5AE]">
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm('Reset calendar data to default Devaswom publication?')) {
                          resetAnnualCalendar();
                          setGeneralForm({
                            malayalamYear: '1202 -ാമാണ്ട്',
                            gregorianYear: '(2026 – 2027)',
                            title: 'പ്രധാന വിശേഷ ദിവസങ്ങൾ',
                            ulsavamTitle: 'തിരുവുത്സവം',
                            ulsavamGregorian: '2027 ഫെബ്രുവരി 28 ഞായർ മുതൽ മാർച്ച് 7 ഞായർ വരെ',
                            ulsavamMalayalam: '(1202 കുംഭം 16 മുതൽ 23 വരെ)',
                            poojaMorning: 'രാവിലെ 04 മുതൽ 10 വരെ',
                            poojaEvening: 'വൈകുന്നേരം 5.30 മുതൽ 7.00 വരെ',
                          });
                        }
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Reset to Original Default</span>
                    </button>

                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-[#610C1B] hover:bg-[#8B1428] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                    >
                      <Save className="w-3.5 h-3.5 text-[#E6BE65]" />
                      <span>Save General Settings</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3.5 bg-white border-t border-[#E4D5AE] flex items-center justify-between text-xs text-[#8C6219] flex-shrink-0">
          <span className="text-[11px] font-medium">
            ✨ Puliyannoor Sree Mahadeva Temple Official Annual Calendar
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-[#610C1B] text-white font-bold hover:bg-[#8B1428] transition-colors cursor-pointer"
          >
            Close Calendar
          </button>
        </div>
      </div>
    </div>
  );
};
