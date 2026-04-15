# 🌡️ Conversor de Escalas Celsius vs Fahrenheit

> **Avaliação Formadora 2 — Prof. Artur**

![React Native](https://img.shields.io/badge/React_Native-Expo-blue?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript)
![Platform](https://img.shields.io/badge/Platform-iOS%20%7C%20Android%20%7C%20Web-green?style=for-the-badge)

---

## 📱 Sobre o Projeto

Aplicativo mobile e web desenvolvido em **React Native com Expo** para conversão de temperaturas entre as escalas **Celsius** e **Fahrenheit**, com visualização em gauges estilo **Manifold** de ar condicionado, inspirado em instrumentos reais de refrigeração.

Desenvolvido como parte da **Avaliação Formadora 2** da disciplina de Desenvolvimento Mobile, sob orientação do **Prof. Artur**.

---

## 🎯 Funcionalidades

- 🔴 **Gauge Vermelho** — Converte Fahrenheit → Celsius (escala de alta pressão)
- 🔵 **Gauge Azul** — Converte Celsius → Fahrenheit (escala de baixa pressão)
- 📊 Gauges estilo **Manifold 3D** com 4 anéis de escala concêntricos (PSI, kPa, bar, °C)
- 🎚️ Slider interativo para ajuste de valores
- ⌨️ Input numérico direto
- 📱 Layout **responsivo**: lado a lado em desktop/tablet, empilhado em mobile
- 🌐 Funciona em **iOS, Android e Web**

---

## 🛠️ Tecnologias Utilizadas

| Tecnologia | Versão |
|---|---|
| React Native | 0.76+ |
| Expo | ~52.0 |
| TypeScript | 5.x |
| react-native-svg | 15.x |
| @react-native-community/slider | 4.x |
| Expo Router | 4.x |

---

## 🚀 Como Executar

### Pré-requisitos
- Node.js 18+
- npm ou yarn
- Expo CLI

### Instalação

```bash
# Clone o repositório
git clone https://github.com/SEU_USUARIO/TemperatureConverter.git

# Entre na pasta
cd TemperatureConverter

# Instale as dependências
npm install

# Instale dependências nativas
npx expo install react-native-svg @react-native-community/slider

# Inicie o projeto
npx expo start
```

### Executar no browser
```bash
npx expo start --web
```

### Executar no celular
Instale o app **Expo Go** no celular e escaneie o QR Code gerado no terminal.

---

## 📁 Estrutura do Projeto

TemperatureConverter/
├── app/
│ ├── (tabs)/
│ ├── _layout.tsx
│ ├── index.tsx
│ └── _layout.tsx
├── assets/
│ └── logo.png
├── README.md
└── package.json

---

## 📐 Escalas dos Gauges

### 🔵 Gauge Azul — Baixa Pressão (Celsius → Fahrenheit)
| Anel | Escala | Mín | Máx |
|---|---|---|---|
| 1 | PSI | 0 | 160 |
| 2 | kPa | 0 | 1100 |
| 3 | bar | 0 | 11 |
| 4 | °C | -40 | 20 |

### 🔴 Gauge Vermelho — Alta Pressão (Fahrenheit → Celsius)
| Anel | Escala | Mín | Máx |
|---|---|---|---|
| 1 | PSI | 0 | 500 |
| 2 | kPa | 0 | 3500 |
| 3 | bar | 0 | 35 |
| 4 | °C | 20 | 80 |

---

## 👨‍💻 Desenvolvido por

**[SEU NOME]**
- GitHub: [@SEU_USUARIO](https://github.com/SEU_USUARIO)

---

## 📚 Avaliação Formadora 2 — Prof. Artur

Este projeto foi desenvolvido como avaliação prática da disciplina de **Desenvolvimento de Aplicativos Mobile**, demonstrando:

- ✅ Desenvolvimento com React Native + Expo
- ✅ Uso de TypeScript
- ✅ Componentização e reutilização de código
- ✅ Responsividade multiplataforma (iOS, Android, Web)
- ✅ Manipulação de SVG para gráficos customizados
- ✅ Gerenciamento de estado com React Hooks
- ✅ Navegação com Expo Router

---

## 📄 Licença

MIT License — livre para uso educacional.
