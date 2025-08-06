"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { apiClient } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { X } from "lucide-react";

const userFormSchema = z.object({
  name: z.string().min(3, "O nome é obrigatório."),
  email: z.string().email("Formato de e-mail inválido."),
  whatsapp_number: z.string().regex(/^\d+$/, "Apenas números são permitidos.").min(10, "O número é muito curto."),
  role: z.enum(["vendedor", "gerente", "administrador"]),
  password: z.string().min(8, "A senha deve ter no mínimo 8 caracteres."),
  password_confirmation: z.string(),
}).refine(data => data.password === data.password_confirmation, {
  message: "As senhas não coincidem.",
  path: ["password_confirmation"],
});

type UserFormValues = z.infer<typeof userFormSchema>;

interface AddUserModalProps {
  onClose: () => void;
  onUserAdded: () => void;
}

export function AddUserModal({ onClose, onUserAdded }: AddUserModalProps) {
  const { toast } = useToast();
  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      role: "vendedor",
    },
  });

  const onSubmit = async (data: UserFormValues) => {
    try {
      const payload = {
        ...data,
        // Adiciona o sufixo padrão ao número de telefone
        whatsapp_number: `${data.whatsapp_number}@s.whatsapp.net`,
      };
      
      await apiClient.createUser(payload);
      
      toast({
        title: "Sucesso!",
        description: "Novo usuário criado.",
      });
      onUserAdded(); // Atualiza a lista na página
      onClose(); // Fecha o modal
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível criar o usuário.",
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Adicionar Novo Vendedor</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome completo" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-mail</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="email@exemplo.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="whatsapp_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nº de WhatsApp (apenas números)</FormLabel>
                    <FormControl>
                      <div className="flex items-center">
                        <Input type="tel" placeholder="5537999999999" {...field} />
                        <span className="ml-2 text-sm text-gray-500">@s.whatsapp.net</span>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Função</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione uma função" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="vendedor">Vendedor</SelectItem>
                        <SelectItem value="gerente">Gerente</SelectItem>
                        <SelectItem value="administrador">Administrador</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Senha</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password_confirmation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirmar Senha</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end pt-4">
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? "Criando..." : "Criar Usuário"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}