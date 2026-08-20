
export interface LeaveRequest {
    id: number;
    employee_id: number;
    raised_date: string;
    start_date: string;
    end_date: string;
    status: string;
    comment: string | null;
}