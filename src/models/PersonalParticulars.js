import mongoose from "mongoose";

const { Schema } = mongoose;

// ----- Sub-schemas -----

const FamilyMemberSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    relationship: { type: String, required: true, trim: true }, // e.g. Spouse, Son, Daughter
    dateOfBirth: { type: Date },
    occupation: { type: String, trim: true },
  },
  { _id: false }
);

const DependentSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    relationship: { type: String, required: true, trim: true },
    dateOfBirth: { type: Date },
    reasonOfDependency: { type: String, trim: true },
  },
  { _id: false }
);

const EducationSchema = new Schema(
  {
    instituteName: { type: String, required: true, trim: true },
    instituteAddress: { type: String, trim: true },
    university: { type: String, trim: true },
    yearFrom: { type: Number },
    yearTo: { type: Number },
    degreeOrExam: { type: String, trim: true },
    mainSubjects: { type: String, trim: true },
    division: { type: String, trim: true },
    marksPercent: { type: Number },
  },
  { _id: false }
);

const LanguageSchema = new Schema(
  {
    language: { type: String, required: true, trim: true },
    speak: { type: Boolean, default: false },
    read: { type: Boolean, default: false },
    write: { type: Boolean, default: false },
  },
  { _id: false }
);

const PastEmploymentSchema = new Schema(
  {
    employerName: { type: String, required: true, trim: true },
    employerAddress: { type: String, trim: true },
    designation: { type: String, trim: true },
    from: { type: Date },
    to: { type: Date },
    salaryOnJoining: { type: Number },
    salaryOnLeaving: { type: Number },
    reasonForLeaving: { type: String, trim: true },
  },
  { _id: false }
);

const PromotionSchema = new Schema(
  {
    promotionFrom: { type: String, trim: true },
    promotionAs: { type: String, trim: true },
    dateOfPromotion: { type: Date },
  },
  { _id: false }
);

const TrainingCourseSchema = new Schema(
  {
    subject: { type: String, trim: true },
    duration: { type: String, trim: true }, // free text like "3 months"
  },
  { _id: false }
);

const ReferenceSchema = new Schema(
  {
    type: {
      type: String,
      enum: ["employment", "personal"],
      default: "employment",
    },
    name: { type: String, required: true, trim: true },
    position: { type: String, required: true, trim: true },
    companyName: { type: String, trim: true },
    address: { type: String, trim: true },
    phone: { type: String, trim: true },
  },
  { _id: false }
);

// Emoluments sub-blocks
const RemunerationSchema = new Schema(
  {
    salary: { type: Number },
    da: { type: Number }, // dearness allowance
    personalPay: { type: Number },
    specialAllowance: { type: Number },
    anyOther: { type: Number },
  },
  { _id: false }
);

const ResidenceSchema = new Schema(
  {
    freeFurnished: { type: Boolean, default: false },
    rentSubsidyAllowance: { type: Number },
    rentPaid: { type: Number },
    ownsHouse: { type: Boolean, default: false },
    telephone: { type: Number },
    furnishingSoft: { type: Number },
    furnishingHard: { type: Number },
  },
  { _id: false }
);

const ConveyanceSchema = new Schema(
  {
    companyCar: { type: Boolean, default: false },
    conveyanceAllowanceSubsidy: { type: Number },
    ownsVehicle: { type: Boolean, default: false },
    vehicleDetails: { type: String, trim: true },
    vehicleMaintenance: { type: Number },
    driver: { type: Number },
  },
  { _id: false }
);

const OtherPerquisitesSchema = new Schema(
  {
    entertainment: { type: Number },
    servantGuard: { type: Number },
    utilities: { type: Number }, // Gas / Water / Electricity
    newspapersMagazines: { type: Number },
    anyOther: { type: Number },
  },
  { _id: false }
);

const RetirementBenefitsSchema = new Schema(
  {
    contributoryPF: { type: Number },
    gratuity: { type: Number },
    pension: { type: Number },
  },
  { _id: false }
);

const OtherBenefitsSchema = new Schema(
  {
    medicalSubsidy: { type: Number },
    lta: { type: Number }, // Leave Travel Allowance
    bonus: { type: Number },
    loans: { type: Number },
    anyOther: { type: Number },
  },
  { _id: false }
);

// ----- Main schema -----

const PersonalParticularsSchema = new Schema(
  {
    // Link to logged-in user / candidate
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },

    // Header
    plantLocation: { type: String, trim: true },
    referenceNo: { type: String, trim: true },
    postAppliedFor: { type: String, trim: true, required: true },

    // Personal particulars
    fullName: {
      first: { type: String, trim: true },
      middle: { type: String, trim: true },
      last: { type: String, trim: true },
    },

    presentAddress: { type: String, trim: true },
    presentPhoneResidence: { type: String, trim: true },
    mobile: { type: String, trim: true },
    email: { type: String, trim: true },

    permanentAddress: { type: String, trim: true },
    permanentPhoneResidence: { type: String, trim: true },

    emergencyAddress: { type: String, trim: true },
    emergencyPhone: { type: String, trim: true },

    fatherOrHusbandName: { type: String, trim: true },
    fatherOrHusbandAddress: { type: String, trim: true },
    fatherOrHusbandOccupation: { type: String, trim: true },
    fatherOrHusbandDesignation: { type: String, trim: true },
    fatherOrHusbandOfficialAddress: { type: String, trim: true },
    fatherOrHusbandLastOccupation: { type: String, trim: true },

    dateOfBirth: { type: Date },
    ageYears: { type: Number },
    placeOfBirth: { type: String, trim: true },
    placeOfOrigin: { type: String, trim: true },

    maritalStatus: { type: String, trim: true }, // single / married / etc
    heightCm: { type: Number },
    weightKg: { type: Number },

    // Family & dependents
    familyMembers: [FamilyMemberSchema], // spouse, sons, daughters
    dependents: [DependentSchema], // other dependents

    // Other info
    otherIncomeSource: { type: String, trim: true },
    otherIncomeAmount: { type: Number },
    courtProceedingsDetails: { type: String, trim: true },
    seriousIllnessDetails: { type: String, trim: true },
    physicalDisabilityDetails: { type: String, trim: true },

    // Education
    educationHistory: [EducationSchema],

    // Languages
    languagesKnown: [LanguageSchema],

    // Extra-curricular
    literaryCulturalArts: { type: String, trim: true },
    socialActivities: { type: String, trim: true },
    hobbiesInterests: { type: String, trim: true },

    // Past employment (excluding present)
    pastEmployment: [PastEmploymentSchema],

    // Present employment
    presentEmployerName: { type: String, trim: true },
    presentEmployerAddress: { type: String, trim: true },
    dateOfAppointment: { type: Date },
    designationOnJoining: { type: String, trim: true },
    presentDesignation: { type: String, trim: true },

    promotions: [PromotionSchema],

    presentPositionInHierarchy: { type: String, trim: true },
    responsibilitiesPresentRole: { type: String, trim: true },
    importantAspectsOfExperience: { type: String, trim: true },

    reasonForSeekingNewAppointment: { type: String, trim: true },
    appearedForTestOrInterviewEarlier: { type: Boolean, default: false },
    appearedForTestOrInterviewDetails: { type: String, trim: true },
    presentEmployerAwareOfApplication: { type: Boolean, default: false },
    relatedToAnyDirector: { type: Boolean, default: false },
    directorRelationshipDetails: { type: String, trim: true },
    noticePeriodToJoin: { type: String, trim: true },
    allowRetainNameOnFileIfUnsuccessful: { type: Boolean, default: false },

    // Professional training
    professionalTrainingCourses: [TrainingCourseSchema],

    additionalInformation: { type: String, trim: true },

    // Present emoluments / CTC breakdown
    emoluments: {
      remuneration: RemunerationSchema,
      residence: ResidenceSchema,
      conveyance: ConveyanceSchema,
      otherPerquisites: OtherPerquisitesSchema,
      retirementBenefits: RetirementBenefitsSchema,
      otherBenefits: OtherBenefitsSchema,
      totalCostToCompany: { type: Number },
      otherRemunerationDetails: { type: String, trim: true },
    },

    // References
    references: [ReferenceSchema], // you can push 2 employment + 1 personal with type field

    // Declaration & office-use
    declarationAccepted: { type: Boolean, default: false },
    declarationPlace: { type: String, trim: true },
    declarationDate: { type: Date },

    // Office use
    officeUse: {
      preliminaryInterviewNotes: { type: String, trim: true },
      preliminaryInterviewDate: { type: Date },
      preliminaryInterviewSignatures: { type: String, trim: true },

      finalInterviewNotes: { type: String, trim: true },
      finalInterviewDate: { type: Date },
      finalInterviewSignatures: { type: String, trim: true },

      decision: { type: String, trim: true },
      decisionDate: { type: Date },
      decisionSignatures: { type: String, trim: true },

      actionTaken: { type: String, trim: true },
      actionDate: { type: Date },
      actionSignatures: { type: String, trim: true },
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

export const PersonalParticulars = mongoose.model(
  "PersonalParticulars",
  PersonalParticularsSchema
);
