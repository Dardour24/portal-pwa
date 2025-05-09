
export interface FormQuestion {
  id: string;
  question_text: string;
  is_required: boolean;
  is_custom: boolean;
  property_id?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface FormAnswer {
  id?: string;
  property_id: string;
  question_id: string;
  answer_text: string;
  created_at?: string;
  updated_at?: string;
}

export interface PropertyFormQA {
  propertyId: string;
  propertyName: string;
  questions: FormQuestion[];
  answers: FormAnswer[];
}
