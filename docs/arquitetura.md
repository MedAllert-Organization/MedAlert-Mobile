# Arquitetura Baseada em Funcionalidade

Nesta abordagem, os arquivos e pastas do app são organizados por funcionalidades/domínios de negócio, e não por tipo técnico (componentes, utils, etc). Isso facilita a escalabilidade, manutenção e colaboração, pois cada funcionalidade fica isolada e autocontida.

## Estrutura Sugerida

```
medallert-mobile/
├── app/
│   ├── auth/
│   │   ├── login.tsx
│   │   ├── register.tsx
│   │   ├── recover-password.tsx
│   │   ├── verify-email.tsx
│   │   └── components/
│   │       ├── AuthForm.tsx
│   │       └── ...
│   ├── medications/
│   │   ├── list.tsx
│   │   ├── details.tsx
│   │   ├── edit.tsx
│   │   └── components/
│   │       ├── MedicationItem.tsx
│   │       └── ...
│   ├── settings/
│   │   ├── index.tsx
│   │   └── components/
│   │       └── SettingsOption.tsx
│   ├── shared/
│   │   ├── components/
│   │   │   ├── ButtonPrimary.tsx
│   │   │   ├── Title.tsx
│   │   │   └── ...
│   │   ├── hooks/
│   │   │   └── useColorScheme.ts
│   │   ├── utils/
│   │   │   ├── jwt.ts
│   │   │   └── ...
│   │   └── constants/
│   │       └── Colors.ts
│   └── ...outras funcionalidades
├── assets/
│   └── images/
│       └── ...
├── providers/
│   ├── app-provider.tsx
│   └── auth-provider.tsx
├── app.json
├── package.json
├── tsconfig.json
```

## Como funciona

- Cada pasta dentro de `app/` representa uma funcionalidade (ex: `auth`, `medications`, `settings`).
- Dentro de cada funcionalidade, ficam as telas, componentes, hooks e utils específicos daquele domínio.
- A pasta `shared/` centraliza recursos reutilizáveis entre funcionalidades (componentes, hooks, utils, constantes).
- `assets/` armazena imagens e recursos estáticos.
- `providers/` contém contextos globais do app (ex: autenticação, tema).
- Arquivos de configuração e dependências ficam na raiz.

Essa estrutura facilita a evolução do app, pois novas funcionalidades podem ser adicionadas sem impactar outras áreas, e times podem trabalhar de forma mais independente.
