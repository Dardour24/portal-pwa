
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

// Schema de validation pour le formulaire de propriété
export const propertySchema = z.object({
  name: z.string().min(1, "Le nom est obligatoire"),
  address: z.string().optional(),
});

export type PropertyFormValues = z.infer<typeof propertySchema>;

interface PropertyFormProps {
  onSubmit: (values: PropertyFormValues) => Promise<void>;
  isSubmitting: boolean;
  onCancel: () => void;
  initialValues?: Partial<PropertyFormValues>;
}

export const PropertyForm = ({ onSubmit, isSubmitting, onCancel, initialValues }: PropertyFormProps) => {
  // Configuration du formulaire avec React Hook Form
  const form = useForm<PropertyFormValues>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      name: initialValues?.name || "",
      address: initialValues?.address || "",
    }
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom du logement</FormLabel>
              <FormControl>
                <Input placeholder="Appartement Paris" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Adresse</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="123 Rue de Paris, 75001 Paris" 
                  {...field} 
                  value={field.value || ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Annuler
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> {initialValues ? 'Modification en cours...' : 'Ajout en cours...'}
              </>
            ) : (
              initialValues ? 'Modifier' : 'Ajouter'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};
