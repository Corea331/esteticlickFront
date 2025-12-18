import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { contactMessagesApi } from "../apis";

export const useGetMessages = () => {
  return useQuery({
    queryKey: ['contactMessages'],
    queryFn: contactMessagesApi.getMessages,
  });
};

export const useCreateMessage = () => {
  return useMutation({
    mutationFn: (data) => contactMessagesApi.createMessage(data),
    onSuccess: () => {
      console.log('Mensaje de contacto creado exitosamente');
    },
    onError: (error) => {
      console.error('Error al crear mensaje de contacto:', error);
    },
  });
};

export const useUpdateMessageStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, status }) => contactMessagesApi.updateStatus(id, status),
    onSuccess: (_, variables) => { 
      queryClient.invalidateQueries({ queryKey: ['contactMessages', variables.id] });
      console.log('Estado del mensaje actualizado exitosamente');
    },
    onError: (error) => {
      console.error('Error al actualizar estado del mensaje:', error);
    },
  });
};

export const useDeleteMessage = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: contactMessagesApi.deleteMessage,
    onSuccess: (_, variables) => { 
      queryClient.invalidateQueries({ queryKey: ['contactMessages', variables.id] });
      console.log('Mensaje eliminado exitosamente');
    },
    onError: (error) => {
      console.error('Error al eliminar mensaje:', error);
    },
  });
};