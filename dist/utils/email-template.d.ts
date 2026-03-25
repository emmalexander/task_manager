interface SubscriptionEmailData {
    userName: string;
    subscriptionName: string;
    renewalDate: string;
    planName: string;
    price: string;
    paymentMethod: string;
    accountSettingsLink: string;
    supportLink: string;
    daysLeft: number;
}
interface OTPEmailData {
    userName: string;
    otp: string;
    type: 'verification' | 'reset';
    expiryMinutes: number;
}
interface EmailTemplate {
    label: string;
    generateSubject: (data: any) => string;
    generateBody: (data: any) => string;
}
export declare const generateEmailTemplate: ({ userName, subscriptionName, renewalDate, planName, price, paymentMethod, accountSettingsLink, supportLink, daysLeft, }: SubscriptionEmailData) => string;
export declare const generateOTPEmailTemplate: ({ userName, otp, type, expiryMinutes, }: OTPEmailData) => string;
interface EmailTemplate {
    label: string;
    generateSubject: (data: any) => string;
    generateBody: (data: any) => string;
}
export declare const emailTemplates: EmailTemplate[];
export {};
//# sourceMappingURL=email-template.d.ts.map