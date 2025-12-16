export function rectsIntersect(a, b) {
  return (
    a.x < b.x + b.w &&
    a.x + a.w > b.x &&
    a.y < b.y + b.h &&
    a.y + a.h > b.y
  );
}

// Коллизия игрока с платформами (просто и стабильно)
export function resolvePlayerPlatforms(player, platforms, worldW, worldH) {
  // границы мира по X
  player.x = Math.max(0, Math.min(worldW - player.w, player.x));

  player.onGround = false;

  for (const p of platforms) {
    const pr = { x: p.x, y: p.y, w: p.w, h: p.h };
    const r = player.rect;

    if (!rectsIntersect(r, pr)) continue;

    // вычислим "перекрытие" по осям
    const overlapX1 = (r.x + r.w) - pr.x;
    const overlapX2 = (pr.x + pr.w) - r.x;
    const overlapY1 = (r.y + r.h) - pr.y;
    const overlapY2 = (pr.y + pr.h) - r.y;

    const minX = Math.min(overlapX1, overlapX2);
    const minY = Math.min(overlapY1, overlapY2);

    // выталкиваем по меньшей оси
    if (minX < minY) {
      // по X
      if (overlapX1 < overlapX2) player.x -= overlapX1;
      else player.x += overlapX2;
    } else {
      // по Y
      if (overlapY1 < overlapY2) {
        // сверху на платформу
        player.y -= overlapY1;
        player.vy = 0;
        player.onGround = true;
      } else {
        // удар головой
        player.y += overlapY2;
        player.vy = 0;
      }
    }
  }

  // если упал ниже мира — пусть Game решает "проигрыш"
  // (здесь только коллизии)
}
