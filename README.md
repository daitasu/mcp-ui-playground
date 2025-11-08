# MCP UI Playground

An experimental implementation of MCP-UI, a mechanism that enables AI agents to return interactive UI components. This project explores the capabilities of the MCP-UI SDK.

## 🚀 Overview

This is an experimental playground built with the MCP-UI SDK to test how AI agents can provide interactive user interfaces.

- **Client**: React + Vite + TypeScript
- **Server**: Express + TypeScript

## 🛠️ Setup

### Requirements
- Node.js 18+
- pnpm 10.18.1+

### Installation

```bash
# Clone the repository
git clone [repo-url]
cd mcp-ui-playground

# Install dependencies
pnpm install
```

## 🎯 Development

### Start all services

```bash
pnpm run dev
```

This will start both client and server simultaneously.

### Start individually

```bash
# Client only
pnpm run dev:client

# Server only
pnpm run dev:server
```

## 📂 Project Structure

```
mcp-ui-playground/
├── packages/
│   ├── client/
│   │   ├── src/
│   │   ├── public/
│   │   └── package.json
│   └── server/
│       ├── src/
│       └── package.json
├── pnpm-workspace.yaml
├── package.json
└── README.md
```