export const accounts = {
    data: [
        {
            name: "DANIEL BENSON",
            account_no: "0239404949",
            bank_code: "001",
        },
        {
            name: "FRANK LAMPARD",
            account_no: "09291930439",
            bank_code: "002",
        },
        {
            name: "MARK ZUCKERBERG",
            account_no: "0432934930",
            bank_code: "001",
        },
        {
            name: "ELON MUSK",
            account_no: "0933434920",
            bank_code: "002",
        },
        {
            name: "VICTOR OSIMHEN",
            account_no: "0239201394",
            bank_code: "003",
        },
    ],
};

export function transferFund({ amount, account_no, bank_code }: { amount: number, account_no: string, bank_code: string }) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            try {
                const accountExist = accounts?.data?.find(
                    (item) =>
                        item.bank_code === bank_code && item.account_no === account_no
                );

                if (accountExist) {
                    const response = {
                        status: 200,
                        data: {
                            message: "Transfer was successful",
                            details: {
                                ...(amount && { amount }),
                                ...(account_no && { account_no }),
                                ...(bank_code && { bank_code }),
                            },
                        },
                    };
                    resolve(response);
                } else {
                    const error = {
                        status: 400,
                        message: "Transfer failed! Incorrect details provided.",
                    };

                    reject(error);
                }
            } catch (err) {
                reject(err);
            }
        }, 3000);
    });
}

