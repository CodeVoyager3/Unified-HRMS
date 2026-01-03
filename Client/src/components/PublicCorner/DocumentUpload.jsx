import React, { useState, useEffect } from 'react';
import { UploadCloud, FileText, ExternalLink, CheckCircle2, ChevronDown, ChevronRight, AlertCircle, Save } from 'lucide-react';

const COMMON_DOCUMENTS = [
    { id: 'identity', label: 'Identity Proof (Aadhar/PAN/Voter/Passport)', required: true },
    { id: 'age', label: 'Age Proof (10th Marksheet/Birth Cert)', required: true },
    { id: 'education', label: 'Educational Certificates (10th, 12th, Graduation)', required: true },
    { id: 'caste', label: 'Caste/Category Certificate (if applicable)', required: false },
    { id: 'noc', label: 'No Objection Certificate (if employed)', required: false },
    { id: 'photos', label: 'Recent Passport Size Photographs (6-10)', required: true },
    { id: 'character', label: 'Character Certificates (Two)', required: true }
];

const POST_SPECIFIC_DOCUMENTS = {
    'EX-01': [ // Clerk
        { id: 'typing', label: 'Skill Test / Typing Speed Certificate', required: true }
    ],
    'EX-02': [ // Police
        { id: 'license', label: 'Driving License (LVM/HMV) - Male Candidates', required: true },
        { id: 'pemt', label: 'Physical Endurance & Measurement Test (PE&MT) Reports', required: true }
    ],
    'EX-03': [ // Engineer
        { id: 'degree', label: 'B.E./B.Tech/Diploma in Civil/Electrical/Mechanical', required: true },
        { id: 'experience', label: 'Professional Experience Certificates', required: false }
    ],
    'EX-04': [ // Teacher
        { id: 'ctet', label: 'CTET Certificate', required: true },
        { id: 'bed', label: 'B.Ed / D.El.Ed / NTT Diploma', required: true },
        { id: 'hindi', label: 'Proof of Passing Hindi at Secondary Level', required: true }
    ]
};

const MANDATORY_FORMS = [
    { id: 'attestation', label: 'Attestation Form (Police Verification)', required: true },
    { id: 'medical', label: 'Medical Fitness Certificate (MCD/Govt Hospital)', required: true },
    { id: 'oath', label: 'Oaths of Allegiance', required: true },
    { id: 'marital', label: 'Marital Status Declaration', required: true }
];

const DocumentUpload = ({ candidateData, onSubmitDocuments }) => {
    const [links, setLinks] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [activeSection, setActiveSection] = useState('common'); // common, specific, mandatory
    const [progress, setProgress] = useState(0);

    const specificDocs = POST_SPECIFIC_DOCUMENTS[candidateData.examId] || [];

    const handleLinkChange = (id, value) => {
        setLinks(prev => ({ ...prev, [id]: value }));
    };

    const calculateProgress = () => {
        const requiredCommon = COMMON_DOCUMENTS.filter(d => d.required).map(d => d.id);
        const requiredSpecific = specificDocs.filter(d => d.required).map(d => d.id);
        const requiredMandatory = MANDATORY_FORMS.filter(d => d.required).map(d => d.id);

        const allRequiredIds = [...requiredCommon, ...requiredSpecific, ...requiredMandatory];
        const filledCount = allRequiredIds.reduce((count, id) => links[id]?.length > 5 ? count + 1 : count, 0);

        return Math.round((filledCount / allRequiredIds.length) * 100);
    };

    useEffect(() => {
        setProgress(calculateProgress());
    }, [links]);


    const handleFinalSubmit = async () => {
        if (progress < 100) {
            if (!confirm("Some required fields seem empty. Are you sure you want to submit?")) return;
        }

        setSubmitting(true);
        try {
            const res = await fetch('http://localhost:3000/api/verification/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: candidateData.email,
                    examId: candidateData.examId,
                    documents: links
                })
            });
            const data = await res.json();
            if (data.success) {
                onSubmitDocuments();
            } else {
                alert(data.message);
            }
        } catch (error) {
            alert("Submission error. Please try again later.");
        } finally {
            setSubmitting(false);
        }
    };

    const SectionHeader = ({ title, id, count }) => (
        <button
            onClick={() => setActiveSection(id)}
            className={`w-full text-left p-4 rounded-lg flex items-center justify-between transition-all mb-2
            ${activeSection === id
                    ? 'bg-purple-100 dark:bg-purple-900/30 text-[#6F42C1] dark:text-purple-300 border border-purple-200 dark:border-purple-800'
                    : 'bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
        >
            <span className="font-bold flex items-center gap-2">
                {activeSection === id ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                {title}
            </span>
            <span className="bg-white dark:bg-gray-700 px-2 py-0.5 rounded text-xs font-mono border border-gray-200 dark:border-gray-600">
                {count} Docs
            </span>
        </button>
    );

    const renderInputs = (docs) => (
        <div className="space-y-4 px-2 py-4 animate-in fade-in duration-300">
            {docs.map(doc => (
                <div key={doc.id} className="relative group">
                    <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 mb-1.5 uppercase flex justify-between">
                        {doc.label}
                        {doc.required && <span className="text-red-500 text-[10px] tracking-wider">* MANDATORY</span>}
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <ExternalLink className={`h-4 w-4 ${links[doc.id] ? 'text-[#6F42C1]' : 'text-gray-400'}`} />
                        </div>
                        <input
                            type="url"
                            className={`w-full pl-9 pr-8 py-2.5 text-sm border rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-[#6F42C1] outline-none transition-all placeholder-gray-400 
                            ${!doc.required || links[doc.id] ? 'border-gray-300 dark:border-gray-600' : 'border-red-300 dark:border-red-900'}`}
                            placeholder="Paste Google Drive Link"
                            value={links[doc.id] || ''}
                            onChange={(e) => handleLinkChange(doc.id, e.target.value)}
                        />
                        {links[doc.id] && (
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                <CheckCircle2 className="h-4 w-4 text-green-500" />
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden max-w-3xl mx-auto">
            <div className="bg-[#6F42C1] dark:bg-[#5a32a3] p-6 border-b border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <FileText className="h-5 w-5 text-purple-200" />
                        Comprehensive Document Dossier
                    </h3>
                    <p className="text-purple-200 text-xs mt-1">
                        Application Ref: {candidateData.examId} / {candidateData.enrollmentNumber}
                    </p>
                </div>
                <div className="bg-black/20 px-4 py-2 rounded-lg backdrop-blur-sm border border-white/10">
                    <div className="flex items-center justify-between gap-4 mb-1">
                        <span className="text-xs text-white/80 font-semibold">Completion</span>
                        <span className="text-xs text-white font-bold">{progress}%</span>
                    </div>
                    <div className="w-32 h-1.5 bg-black/20 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-green-400 transition-all duration-500"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>
            </div>

            <div className="p-6">
                <div className="bg-purple-50 dark:bg-purple-900/10 p-4 rounded-lg border-l-4 border-[#6F42C1] mb-6 flex gap-3 text-sm text-gray-700 dark:text-gray-300">
                    <AlertCircle className="h-5 w-5 text-[#6F42C1] flex-shrink-0" />
                    <div>
                        <p className="font-semibold text-[#6F42C1] mb-1">Submission Instructions:</p>
                        <p className="text-xs leading-relaxed opacity-80">
                            Please upload each specific document to Google Drive and paste the shareable link (view access enabled) in the corresponding field below.
                            Ensure all scans are clear and legible.
                        </p>
                    </div>
                </div>

                <div className="space-y-1">
                    <SectionHeader title="1. Common Required Documents" id="common" count={COMMON_DOCUMENTS.length} />
                    {activeSection === 'common' && renderInputs(COMMON_DOCUMENTS)}

                    <SectionHeader title={`2. Post-Specific Documents (${candidateData.examId})`} id="specific" count={specificDocs.length} />
                    {activeSection === 'specific' && renderInputs(specificDocs)}

                    <SectionHeader title="3. Mandatory Joining Forms (MCD)" id="mandatory" count={MANDATORY_FORMS.length} />
                    {activeSection === 'mandatory' && renderInputs(MANDATORY_FORMS)}
                </div>

                <div className="pt-8 border-t border-gray-100 dark:border-gray-700 mt-6">
                    <button
                        onClick={handleFinalSubmit}
                        disabled={submitting}
                        className="w-full bg-[#6F42C1] hover:bg-[#5a32a3] text-white py-4 rounded-lg font-bold shadow-md hover:shadow-lg transform active:scale-[0.99] transition-all flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed text-lg"
                    >
                        {submitting ? (
                            <>
                                <UploadCloud className="h-6 w-6 animate-bounce" /> Encrypting & Submitting Dossier...
                            </>
                        ) : (
                            <>
                                <Save className="h-5 w-5" /> Submit Final Dossier
                            </>
                        )}
                    </button>
                    <p className="text-center text-[10px] text-gray-400 mt-3 font-mono">
                        SECURE_TRANSMISSION_PROTOCOL_V2 // ID: {candidateData._id}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default DocumentUpload;
