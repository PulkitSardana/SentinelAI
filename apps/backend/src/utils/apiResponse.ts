export class APIResponse<T> {
    public success: boolean;
    public message: string;
    public data: T | null;
    public timestamp: string;
    // requestId will be attached dynamically in a middleware later

    constructor(success: boolean, message: string, data: T | null = null) {
        this.success = success;
        this.message = message;
        this.data = data;
        this.timestamp = new Date().toISOString();
    }

    static success<T>(message: string, data: T | null = null) {
        return new APIResponse(true, message, data);
    }

    static error(message: string) {
        return new APIResponse(false, message, null);
    }
}
