
[English](README.md) | [日本語](README-jp.md) | [العربية](README-ar.md) | [Português](README-pt.md) | [Español](README-es.md)

# Mini Programa Empresarial de Shenzhen

## Visão Geral
Este é um mini programa empresarial multiplataforma construído com **UniApp** para negócios em Shenzhen. Ele possui gerenciamento de atividades, sistemas de pagamento, fluxos de autenticação e recursos para compartilhamento de conteúdo. A base de código demonstra práticas modernas de Vue.js com extensões UniApp.

## Principais Recursos e Componentes

### 1. Gerenciamento de Atividades (`activity.vue`)
```vue
<u-count-down :timestamp="invite_info.times" separator="zh"></u-count-down>
<button open-type="share">Continuar Compartilhando</button>
````

* **Campanhas de Pacotes Vermelhos**: atividades de recompensa por tempo limitado com cronômetros regressivos
* **Sistema de Convite**: rastreamento de usuários convidados e limites de recompensa
* **Compartilhamento no WeChat**: funcionalidade nativa de compartilhamento com caminhos personalizados
* **Design Responsivo**: cálculo dinâmico de altura para barras de navegação

### 2. Sistema de Pagamento (`pay.vue`)

```vue
<u-radio-group v-model="payType">
  <u-radio name="1">WeChat Pay</u-radio>
  <u-radio name="2">Desconto com Voucher</u-radio>
</u-radio-group>
<button @click="pay()">Pagar Agora</button>
```

* **Dois Métodos de Pagamento**:

  * Integração com WeChat Pay
  * Sistema de resgate de vouchers/pontos
* **Transações Seguras**: API de pagamento encapsulada com autenticação por token
* **Integração de Anúncios**: anúncios intersticiais após pagamentos bem-sucedidos

### 3. Autenticação Empresarial (`auth.vue`)

```vue
<input name="name" placeholder="Nome da Empresa">
<button @click="upload(1)">Enviar Licença Comercial</button>
```

* **Verificação Comercial**:

  * Registro do nome da empresa
  * Envio da licença comercial
  * Validação do ID do representante legal
* **Manipulação de Imagens**: pré-visualização do upload e gerenciamento de permissões

### 4. Gerenciamento de Conteúdo (`article.vue`)

```vue
<rich-text :nodes="info.content"></rich-text>
<button @click="downLoad(v.file)">Baixar Anexo</button>
```

* **Exibição de Texto Rico**: renderização segura de conteúdo HTML
* **Gerenciamento de Arquivos**:

  * Pré-visualização de imagens com zoom
  * Downloads seguros com verificação de permissões
* **Sistema de Comentários**: threads aninhadas com marcação de usuários

### 5. Modelos de Acordos (`agreement.vue`)

```vue
<u-parse :html="content"></u-parse>
```

* **Carregamento Dinâmico de Conteúdo**: busca acordos do backend
* **Suporte a Dois Modelos**:

  * Acordos de usuário
  * Contratos de parceria

### 6. Sistema de Faturamento (`bill/detail.vue`)

```vue
<view v-if="bill.status == 1">Status: Não pago</view>
<button @click="viewPayType">Pagar Agora</button>
```

* **Rastreamento do Status de Pagamento**: atualizações em tempo real do status da fatura
* **Interface Unificada de Pagamento**: componente reutilizável de pagamento
* **Cálculos de Voucher**: conversão dinâmica de pontos em dinheiro

## Destaques Técnicos

### Tecnologias Principais

* **Framework UniApp**: desenvolvimento multiplataforma
* **Composição Vue.js**: gerenciamento reativo de dados
* **uView UI**: biblioteca consistente de componentes
* **APIs do WeChat Mini Program**: integração de funcionalidades nativas

### Práticas de Segurança

```javascript
// Exemplo de validação de token
app.isLogin().then(() => {
  app.checkLogin2();
  that.getUser();
});
```

* Validação de token API para operações sensíveis
* Gerenciamento de permissões do álbum de fotos
* Transmissão segura de parâmetros de pagamento

### Otimizações de Desempenho

* Carregamento de imagens sob demanda
* Sistema de paginação de comentários
* Renderização de conteúdo baseada em WebView (`detail.vue`)
* Carregamento preguiçoso de anúncios com tratamento de erros

## Cenários de Uso

1. **Campanhas de Marketing**: promoções temporárias com incentivos para compartilhamento
2. **Conteúdo Pago**: monetização de artigos/vídeos com opções flexíveis de pagamento
3. **Autenticação B2B**: integração de parceiros empresariais com verificação
4. **Gerenciamento Financeiro**: rastreamento e pagamento de faturas dentro do mini programa
5. **Compartilhamento de Recursos**: distribuição segura de documentos empresariais

> **Nota**: Este mini programa integra-se com os recursos do ecossistema WeChat, incluindo login, pagamento e compartilhamento, mantendo padrões de segurança corporativa.

