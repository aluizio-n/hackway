import uuid
from datetime import date

from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.constants import PTES_PHASES
from app.modules.reports.repository import ReportRepository


class ReportController:
    def __init__(self, db: AsyncSession) -> None:
        self.repo = ReportRepository(db)

    async def generate(self, target_id: uuid.UUID, owner_id: uuid.UUID, report_type: str) -> dict:
        target = await self.repo.get_target_for_owner(target_id, owner_id)
        if target is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Alvo não encontrado")

        notes_by_phase = await self.repo.get_notes_by_phase(target_id)
        today = date.today().strftime("%d/%m/%Y")

        if report_type == "tech":
            scope_lines = "\n".join(
                f"  • {p['num']} - {p['name']}" for i, p in enumerate(PTES_PHASES) if target.scope_phases[i]
            )
            findings = "\n".join(
                f"\n[{PTES_PHASES[i]['name']}]\n{content}" for i, content in sorted(notes_by_phase.items())
            ) or "  Nenhuma nota registrada."

            content = (
                "═══════════════════════════════════════════\n"
                "  RELATÓRIO TÉCNICO DE PENTEST\n"
                f"  Alvo: {target.name}\n"
                f"  Tipo: {target.type}\n"
                f"  Endereço: {target.address}\n"
                f"  Data: {today}\n"
                "═══════════════════════════════════════════\n\n"
                "1. RESUMO\n─────────────────────\n"
                f"Teste de penetração realizado no alvo {target.name}.\n\n"
                "2. ESCOPO\n─────────────────────\n"
                f"{scope_lines}\n\n"
                "3. FINDINGS\n─────────────────────\n"
                f"{findings}\n\n"
                "4. RECOMENDAÇÕES\n─────────────────────\n  (Adicione recomendações)\n\n"
                "5. CONCLUSÃO\n─────────────────────\n  (Resumo final)"
            )
            return {"title": "Relatório Técnico", "content": content}

        content = (
            "═══════════════════════════════════════════\n"
            "  RELATÓRIO EXECUTIVO\n"
            f"  {target.name}\n"
            f"  {today}\n"
            "═══════════════════════════════════════════\n\n"
            "VISÃO GERAL\n─────────────────────\n"
            f"Teste de segurança realizado em {target.name}\n({target.address})\n\n"
            "NÍVEL DE RISCO: [DEFINIR]\n\n"
            "PRINCIPAIS RISCOS\n─────────────────────\n"
            "  1. [Risco crítico]\n  2. [Risco alto]\n  3. [Risco médio]\n\n"
            "IMPACTO NO NEGÓCIO\n─────────────────────\n  (Impacto potencial)\n\n"
            "RECOMENDAÇÕES\n─────────────────────\n"
            "  1. [Ação imediata]\n  2. [Curto prazo]\n  3. [Médio prazo]"
        )
        return {"title": "Relatório Executivo", "content": content}
