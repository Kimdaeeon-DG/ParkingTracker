import React from 'react';
import { ParkingRecord } from '@/utils/types';
import { formatDate } from '@/utils/dateFormat';

interface ParkingRecordListProps {
  records: ParkingRecord[];
  onDelete?: (id: string) => void;
  deleteLoadingId?: string | null;
}

const ParkingRecordList: React.FC<ParkingRecordListProps> = ({ records, onDelete, deleteLoadingId }) => {
  if (records.length === 0) {
    return (
      <div className="mt-8 text-center text-gray-500">
        <p>아직 기록된 주차 위치가 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="mt-8 w-full max-w-md mx-auto">
      <h2 className="mb-2 text-lg font-semibold">🕒 최근 주차 기록</h2>
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {records.map((record) => (
          <div 
            key={record.id} 
            className="flex items-center p-3 border-b last:border-b-0 group"
          >
            <div 
              className={`w-2 h-10 mr-3 rounded-full ${
                record.floor === 'Y' || record.floor === 'G' 
                  ? 'bg-green-500' 
                  : 'bg-pink-500'
              }`}
            />
            <div className="flex-1">
              <div className="flex justify-between items-center">
                <div>
                  <span className="font-medium">
                    {record.car} | {
                      (record.floor === 'Y' || record.floor === 'G') 
                        ? '지하 1층' 
                        : '지하 2층'
                    } | {record.floor}{record.number}
                  </span>
                </div>
                <span className="text-sm text-gray-500">
                  {formatDate(record.created_at)}
                </span>
              </div>
            </div>
            {onDelete && (
              <button
                className="ml-2 text-gray-400 hover:text-red-500 transition-colors flex items-center justify-center min-w-[2em]"
                title="삭제"
                onClick={() => onDelete(record.id)}
                disabled={deleteLoadingId === record.id}
              >
                {deleteLoadingId === record.id ? (
                  <span className="animate-spin">⏳</span>
                ) : (
                  '🗑️'
                )}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ParkingRecordList;
