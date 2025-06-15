import { supabase } from './supabaseClient';
import { ParkingRecord, FloorType } from './types';

const TABLE = 'parking_records';

export async function fetchRecords(userId: string): Promise<ParkingRecord[]> {
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(10);
  if (error) throw error;
  return data as ParkingRecord[];
}

export async function addRecordToDB(record: Omit<ParkingRecord, 'created_at'> & { user_id: string }) {
  const { error } = await supabase.from(TABLE).insert([record]);
  if (error) throw error;
}

export async function deleteRecordFromDB(id: string, userId: string) {
  const { error } = await supabase
    .from(TABLE)
    .delete()
    .eq('id', id)
    .eq('user_id', userId);
  if (error) throw error;
}
