
interface ValidationErrorsProps {
  errors: string[];
}

export const ValidationErrors = ({ errors }: ValidationErrorsProps) => {
  if (errors.length === 0) {
    return null;
  }
  
  return (
    <div className="bg-destructive/10 border border-destructive text-destructive p-3 rounded-md">
      <p className="font-semibold">Veuillez corriger les erreurs suivantes :</p>
      <ul className="list-disc list-inside">
        {errors.map((error, index) => (
          <li key={index}>{error}</li>
        ))}
      </ul>
    </div>
  );
};
