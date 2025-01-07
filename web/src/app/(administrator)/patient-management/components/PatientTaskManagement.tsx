/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react";
import { Patient } from "../types/types";
import { FaUserInjured, FaHeartbeat, FaTimes } from "react-icons/fa";
import { motion } from "framer-motion";
import { HfInference } from "@huggingface/inference";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Image from "next/image";

const hfInference = new HfInference(process.env.HUGGING_FACE_API_KEY!);
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);

interface Props {
  patients: Patient[];
  selectedArea: string;
  onSelect: (patient: Patient) => void;
  departments: Record<string, string[]>;
}

export const PatientTaskManagement: React.FC<Props> = ({
  patients,
  selectedArea,
  onSelect,
  departments,
}) => {
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [generatedData, setGeneratedData] = useState<{
    recommendation?: string;
    imageBlobUrl?: string;
  }>({});
  const [generatedImages, setGeneratedImages] = useState<Record<string, string>>({});

  const isAllDepartments = selectedArea === "todos";

  const categorizedPatients: Record<string, Record<string, Patient[]>> = {};

  Object.keys(departments).forEach((department) => {
    categorizedPatients[department] = {};
    departments[department].forEach((status) => {
      categorizedPatients[department][status] = [];
    });
  });

  patients.forEach((patient: Patient) => {
    const latestStatus = patient?.admission?.statusHistory?.sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    )[0];

    const department = latestStatus?.department?.trim().toLowerCase() || "sem departamento";
    const status = latestStatus?.status?.trim().toLowerCase() || "status desconhecido";

    if (!categorizedPatients[department]) {
      categorizedPatients[department] = {};
    }
    if (!categorizedPatients[department][status]) {
      categorizedPatients[department][status] = [];
    }
    categorizedPatients[department][status].push(patient);
  });

  const generateData = async (patient: Patient) => {
    const prompt = `Paciente ${patient.personalInfo.name}, ${patient.personalInfo.age} anos, com status: ${patient.admission.statusHistory[0].status}. Recomende os próximos passos e crie uma imagem correspondente.`;
  
    try {
      const [recommendationResult, imageResult] = await Promise.all([
        genAI
          .getGenerativeModel({ model: "gemini-pro" })
          .generateContent(prompt)
          .then((res) => res.response.text()),
        hfInference
          .textToImage({
            inputs: prompt,
            model: "stabilityai/stable-diffusion-3.5-large",
          })
          .then((blob) => URL.createObjectURL(blob)),
      ]);
  
      setGeneratedData({
        recommendation: recommendationResult,
        imageBlobUrl: imageResult,
      });
  
      setGeneratedImages((prev) => ({ ...prev, [patient.id]: imageResult })); // Vincula imagem ao ID do paciente
    } catch (error) {
      console.error("Erro ao gerar dados:", error);
      setGeneratedData({
        recommendation: "Erro ao gerar recomendação.",
      });
    }
  };

  const handleCardClick = (patient: Patient) => {
    setSelectedPatient(patient);
    generateData(patient);
  };

  const estimateDischargeDate = (admissionDate: string, avgStayDuration: number) => {
    const admission = new Date(admissionDate);
    admission.setDate(admission.getDate() + avgStayDuration);
    return admission.toLocaleDateString();
  };

  return (
    <div className="grid grid-cols-3 gap-6 p-4 bg-gray-200 dark:bg-gray-900">
      {isAllDepartments
        ? Object.entries(categorizedPatients).map(([department, statuses]) => (
            <motion.div
              key={department}
              className="bg-gray-100 dark:bg-gray-800 text-white p-6 rounded-lg shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h3 className="text-2xl font-bold flex items-center gap-2">
                <FaHeartbeat /> {department.toUpperCase()}
              </h3>
              {Object.entries(statuses).map(([status, patients]) => (
                <div key={status} className="mt-4">
                  <h4 className="font-semibold text-lg text-gray-300">{status}</h4>
                  {patients.map((patient) => (
                    <motion.div
                      key={patient.id}
                      className="p-4 bg-gray-800 text-white rounded-lg shadow-md flex items-center gap-4 border-l-4 relative"
                      style={{ borderColor: department }}
                      onClick={() => handleCardClick(patient)}
                      whileHover={{ scale: 1.05 }}
                    >
                      <Image
                        src={`${patient.personalInfo.image}` || "/images/default-avatar.png"}
                        alt={patient.personalInfo.name}
                        width={50}
                        height={50}
                        className="rounded-full"
                      />
                      {generatedImages[patient.id] && (
                        <Image
                            src={generatedImages[patient.id]}
                            alt="Recomendação gerada"
                            width={80}
                            height={80}
                            className="absolute right-4 top-4 rounded-lg"
                        />
                       )}
                      <div className="flex-1">
                        <p className="font-semibold text-lg">{patient.personalInfo.name}</p>
                        <p className="text-sm text-gray-400">{department}</p>
                      </div>
                      <FaUserInjured className="text-3xl text-red-500" />
                    </motion.div>
                  ))}
                </div>
              ))}
            </motion.div>
          ))
        : Object.entries(categorizedPatients[selectedArea] || {}).map(([status, patients]) => (
            <motion.div
              key={status}
              className="bg-gray-100 dark:bg-gray-800 text-white p-6 rounded-lg shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h3 className="text-2xl font-bold flex items-center gap-2">
                <FaHeartbeat /> {status.toUpperCase()}
              </h3>
              {patients.map((patient) => (
                <motion.div
                  key={patient.id}
                  className="p-4 bg-gray-800 text-white rounded-lg shadow-md flex items-center gap-4 border-l-4 relative"
                  style={{ borderColor: selectedArea }}
                  onClick={() => handleCardClick(patient)}
                  whileHover={{ scale: 1.05 }}
                >
                   <Image
                        src={generatedImages[patient.id]}
                        alt="Recomendação gerada"
                        width={80}
                        height={80}
                        className="absolute right-4 top-4 rounded-lg"
                    />
                  {patient.generatedImage && (
                    <Image
                        src={generatedImages[patient.id]}
                        alt="Recomendação gerada"
                        width={80}
                        height={80}
                        className="absolute right-4 top-4 rounded-lg"
                    />
                  )}
                  <div className="flex-1">
                    <p className="font-semibold text-lg">{patient.personalInfo.name}</p>
                    <p className="text-sm text-gray-400">{selectedArea}</p>
                  </div>
                  <FaUserInjured className="text-3xl text-red-500" />
                </motion.div>
              ))}
            </motion.div>
          ))}

      {selectedPatient && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center">
          <motion.div
            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-3xl w-full relative"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <button
              onClick={() => setSelectedPatient(null)}
              className="absolute top-4 right-4 text-gray-500 dark:text-gray-300 hover:text-red-500"
            >
              <FaTimes size={24} />
            </button>
            <h3 className="text-2xl font-bold mb-4">
              {selectedPatient.personalInfo.name}
            </h3>
            <div className="mb-4">
              <h4 className="text-lg font-semibold">Recomendações:</h4>
              <p>{generatedData.recommendation}</p>
            </div>
            {generatedData.imageBlobUrl && (
                <Image
                    src={generatedData.imageBlobUrl}
                    alt="Recomendação gerada"
                    width={400}
                    height={200}
                    className="rounded-lg mx-auto"
                />
            )}
            <p className="text-sm mt-6">Previsão de Alta: {estimateDischargeDate(selectedPatient.admission.date, 7)}</p>
            <button className="bg-gradient-to-r from-blue-500 to-teal-500 text-white px-4 py-2 rounded-md mt-4 w-full">
              Gerar Diagrama Funcional
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
};