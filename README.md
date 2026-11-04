# Finanças do Davi

Painel pessoal: receitas e despesas (à vista, parceladas ou recorrentes), cartões, para onde vai o dinheiro e plano de quitação das dívidas.

- Site estático em GitHub Pages, instalável no iPhone (Compartilhar > Adicionar à Tela de Início).
- Login e dados no Firebase (Authentication e Firestore, região São Paulo).
- Nenhum dado financeiro fica neste repositório. A chave em `app.js` é a configuração pública do app web do Firebase; quem protege os dados são as regras do Firestore, que só liberam a conta do dono com e-mail verificado.

`firebase-bundle.js` é o SDK oficial do Firebase empacotado, para o app abrir sem internet.
