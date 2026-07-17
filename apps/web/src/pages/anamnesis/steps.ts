export type FieldType = "text" | "textarea" | "number" | "date" | "select" | "boolean";

export interface FieldConfig {
  key: string;
  label: string;
  type: FieldType;
  options?: { value: string; label: string }[];
  placeholder?: string;
}

export interface StepConfig {
  title: string;
  description?: string;
  fields: FieldConfig[];
}

/** Espelha escopo.md §7.1 — cada etapa é um grupo de campos da anamnese única. */
export const steps: StepConfig[] = [
  {
    title: "Dados pessoais",
    fields: [
      { key: "sex", label: "Sexo", type: "select", options: [
        { value: "feminino", label: "Feminino" },
        { value: "masculino", label: "Masculino" },
        { value: "outro", label: "Outro" },
      ] },
      { key: "birthDate", label: "Data de nascimento", type: "date" },
      { key: "heightCm", label: "Altura (cm)", type: "number" },
      { key: "weightKg", label: "Peso (kg)", type: "number" },
      { key: "profession", label: "Profissão", type: "text" },
    ],
  },
  {
    title: "Objetivo",
    fields: [
      { key: "goal", label: "Qual seu principal objetivo?", type: "select", options: [
        { value: "EMAGRECER", label: "Emagrecer" },
        { value: "GANHAR_MASSA", label: "Ganhar massa" },
        { value: "SAUDE", label: "Saúde" },
        { value: "LONGEVIDADE", label: "Longevidade" },
      ] },
      { key: "goalDescription", label: "O que você espera conquistar?", type: "textarea" },
    ],
  },
  {
    title: "Alimentação",
    fields: [
      { key: "mealsPerDay", label: "Refeições por dia", type: "number" },
      { key: "waterLitersPerDay", label: "Água por dia (litros)", type: "number" },
      { key: "preferredFoods", label: "Alimentos preferidos", type: "textarea" },
      { key: "dislikedFoods", label: "Alimentos que não gosta", type: "textarea" },
      { key: "supplements", label: "Suplementos que usa", type: "textarea" },
      { key: "allergies", label: "Alergias", type: "textarea" },
      { key: "intolerances", label: "Intolerâncias", type: "textarea" },
      { key: "previousDiets", label: "Dietas anteriores", type: "textarea" },
    ],
  },
  {
    title: "Saúde",
    fields: [
      { key: "diseases", label: "Doenças", type: "textarea" },
      { key: "medications", label: "Medicamentos em uso", type: "textarea" },
      { key: "surgeries", label: "Cirurgias", type: "textarea" },
      { key: "alteredExams", label: "Exames alterados", type: "textarea" },
      { key: "nutritionalDeficiencies", label: "Deficiências nutricionais", type: "textarea" },
      { key: "orthopedicIssues", label: "Problemas ortopédicos", type: "textarea" },
      { key: "familyHistory", label: "Histórico familiar", type: "textarea" },
    ],
  },
  {
    title: "Sono",
    fields: [
      { key: "sleepQuality", label: "Qualidade do sono", type: "select", options: [
        { value: "ruim", label: "Ruim" },
        { value: "regular", label: "Regular" },
        { value: "boa", label: "Boa" },
        { value: "otima", label: "Ótima" },
      ] },
      { key: "sleepHours", label: "Horas de sono por noite", type: "number" },
      { key: "sleepTime", label: "Horário que costuma dormir", type: "text", placeholder: "ex.: 23h" },
      { key: "wakeTime", label: "Horário que costuma acordar", type: "text", placeholder: "ex.: 7h" },
    ],
  },
  {
    title: "Função intestinal",
    fields: [
      { key: "bowelFunction", label: "Como você descreveria sua função intestinal?", type: "select", options: [
        { value: "NORMAL", label: "Normal" },
        { value: "CONSTIPACAO", label: "Constipação" },
        { value: "DIARREIA", label: "Diarreia" },
        { value: "IRREGULAR", label: "Irregular" },
      ] },
    ],
  },
  {
    title: "Hábitos",
    fields: [
      { key: "smokes", label: "Fuma?", type: "boolean" },
      { key: "drinksAlcohol", label: "Bebe álcool?", type: "boolean" },
    ],
  },
  {
    title: "Exercícios",
    fields: [
      { key: "activityLevel", label: "Nível de atividade", type: "select", options: [
        { value: "sedentario", label: "Sedentário" },
        { value: "ativo", label: "Ativo" },
      ] },
      { key: "trainingSince", label: "Há quanto tempo treina", type: "text" },
      { key: "trainingDaysPerWeek", label: "Dias de treino por semana", type: "number" },
      { key: "modality", label: "Modalidade", type: "text" },
      { key: "availableEquipment", label: "Equipamentos disponíveis", type: "textarea" },
      { key: "painfulExercises", label: "Exercícios que provocam dor", type: "textarea" },
      { key: "avoidedExercises", label: "Exercícios que prefere evitar", type: "textarea" },
    ],
  },
  {
    title: "Avaliação física inicial",
    description: "Opcional — você pode preencher depois na área de Evolução.",
    fields: [
      { key: "assessment.waistCm", label: "Circunferência da cintura (cm)", type: "number" },
      { key: "assessment.abdomenCm", label: "Circunferência abdominal (cm)", type: "number" },
      { key: "assessment.armCm", label: "Circunferência do braço (cm)", type: "number" },
      { key: "assessment.thighCm", label: "Circunferência da coxa (cm)", type: "number" },
      { key: "assessment.muscleMassKg", label: "Massa muscular (kg) — opcional", type: "number" },
      { key: "assessment.fatMassKg", label: "Massa de gordura (kg) — opcional", type: "number" },
    ],
  },
];
