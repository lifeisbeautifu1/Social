import { useLocation } from 'react-router-dom';
import { IMessageNotification } from '../interfaces';
export const useQuery = () => new URLSearchParams(useLocation().search);

export function onlyUniqueNotifications(
  value: IMessageNotification,
  index: number,
  self: IMessageNotification[]
): boolean {
  return self?.map((n) => n?.from?._id).indexOf(value?.from?._id) === index;
}
