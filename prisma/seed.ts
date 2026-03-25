import { PrismaClient, InvoiceStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { Acme } from 'next/font/google';

const prisma = new PrismaClient();

async function main() {
    console.log('Iniciando pupulação do banco de dados...')

    const password = await bcrypt.hash('password', 10);

    const user = await prisma.user.upsert({
        where: { email: 'admin@Acme.com' },
        update: {},
        create: {
            name: 'Admin',
            email: 'admin@acme.com',
            password: password
        }
    });

    console.log('Usuário criado com sucesso.');

    const customer_data = [{
        name: 'Alex Bessa',
        email: 'alex@email.com',
        imageUrl: 'https://ui-avatars.com/api/?name=Alex+Bessa&background=radom'
    }, {
        name: 'Valdiana Bessa',
        email: 'valdiana@email.com',
        imageUrl: 'https://ui-avatars.com/api/?name=Valdiana+Bessa&background=radom'
    }, {
        name: 'Timóteo Bessa',
        email: 'timoteo@email.com',
        imageUrl: 'https://ui-avatars.com/api/?name=Timoteo+Bessa&background=radom'
    }];

    const customers = [];

    for (const data of customer_data) {
        const customer = await prisma.customer.upsert({
            where: { email: data.email },
            update: {},
            create: data
        });

        customers.push(customer);
        console.log('Cliente criado: ${ customer.name }');
    };

    const invoicesData = [{
        amount: 15785,
        status: InvoiceStatus.PENDENTE,
        date: '2026-29-05',
        customer: customers[0]
    }, {
        amount: 5722,
        status: InvoiceStatus.PENDENTE,
        date: '2026-15-05',
        customer: customers[1]
    }, {
        amount: 154225785,
        status: InvoiceStatus.PENDENTE,
        date: '2026-12-05',
        customer: customers[2]
    }, {
        amount: 15474785,
        status: InvoiceStatus.PENDENTE,
        date: '2026-15-05',
        customer: customers[0]
    }, {
        amount: 4747,
        status: InvoiceStatus.PAGO,
        date: '2026-05-05',
        customer: customers[1]
    }, {
        amount: 747,
        status: InvoiceStatus.PAGO,
        date: '2026-15-05',
        customer: customers[2]
    }, {
        amount: 7575,
        status: InvoiceStatus.PENDENTE,
        date: '2026-16-05',
        customer: customers[0]
    }, {
        amount: 5777,
        status: InvoiceStatus.PAGO,
        date: '2026-03-05',
        customer: customers[1]
    }, {
        amount: 5757,
        status: InvoiceStatus.PAGO,
        date: '2026-01-05',
        customer: customers[2]
    }, {
        amount: 5858,
        status: InvoiceStatus.PENDENTE,
        date: '2026-16-05',
        customer: customers[0]
    }, {
        amount: 5959,
        status: InvoiceStatus.PAGO,
        date: '2026-08-05',
        customer: customers[1]
    }, {
        amount: 1578591,
        status: InvoiceStatus.PENDENTE,
        date: '2026-20-05',
        customer: customers[2]
    }];

    for (const data of invoicesData) {
        await prisma.invoice.create({
            data: {
                amount: data.amount,
                status: data.status,
                date: new Date(data.date),
                customerId: data.customer.id
            }
        });
    };

    console.log(`${invoicesData.length} faturas criadas.`);

    const revenueData = [
        { month: 'Jan', revenue: 65748461 },
        { month: 'Fev', revenue: 69562131 },
        { month: 'Mar', revenue: 8556565 },
        { month: 'Abr', revenue: 95653 },
        { month: 'Mai', revenue: 9756232 },
        { month: 'Jun', revenue: 98465103 },
        { month: 'Jul', revenue: 1541656 },
        { month: 'Ago', revenue: 8979613 },
        { month: 'Set', revenue: 784152103 },
        { month: 'Out', revenue: 3265232 },
        { month: 'Nov', revenue: 1656566565 },
        { month: 'Dez', revenue: 646562266 },
    ];

    for (const data of revenueData) {
        await prisma.revenue.upsert({
            where: { month: data.month },
            update: { revenue: data.revenue },
            create: data
        });
    };

    console.log('Dados de receita mensal criados.');

    console.log('População concluída com sucesso.');
};

main()
    .catch((erro) => {
        console.log('Erro ao popular o banco:', erro);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });