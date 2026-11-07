import React from 'react';
import { SqlTable } from '../types';
import styles from './DataTables.module.css';

interface Props {
  tables?: SqlTable[];
}

/**
 * Read-only previews of the tables a SQL question reads from. Each grid caps
 * its height and scrolls inside itself, so a long table never pushes the
 * question past the desktop viewport.
 */
/** Decimal places per column, so 129 and 24.99 line up as 129.00 and 24.99. */
function columnDecimals(t: SqlTable): number[] {
  return t.columns.map((_, c) =>
    t.rows.reduce((max, row) => {
      const v = row[c];
      if (typeof v !== 'number' || Number.isInteger(v)) return max;
      return Math.max(max, String(v).split('.')[1]?.length ?? 0);
    }, 0),
  );
}

export const DataTables: React.FC<Props> = ({ tables }) => {
  if (!tables || tables.length === 0) return null;
  return (
    <div className={styles.tables} aria-label="Sample data" data-shrink>
      {tables.map(t => { const decimals = columnDecimals(t); return (
        <figure className={styles.table} key={t.name}>
          <figcaption className={styles.name}>{t.name}</figcaption>
          <div className={styles.scroll}>
            <table>
              <thead>
                <tr>
                  {t.columns.map(c => (
                    <th key={c} scope="col">{c}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {t.rows.length === 0 ? (
                  <tr>
                    <td className={styles.empty} colSpan={t.columns.length}>(no rows)</td>
                  </tr>
                ) : (
                  t.rows.map((row, r) => (
                    <tr key={r}>
                      {row.map((cell, c) =>
                        cell === null ? (
                          <td key={c} className={styles.null}>NULL</td>
                        ) : (
                          <td key={c} className={typeof cell === 'number' ? styles.num : undefined}>
                            {typeof cell === 'number' && decimals[c] > 0 ? cell.toFixed(decimals[c]) : String(cell)}
                          </td>
                        ),
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </figure>
      ); })}
    </div>
  );
};
