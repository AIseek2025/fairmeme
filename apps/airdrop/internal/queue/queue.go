package queue

import (
	"context"
	"sync"

	"github.com/fair-meme/fairmeme/apps/airdrop/internal/cond"
)

// Queue is a thread-safe queue.
//
// Unlike a Go channel, Queue doesn't have any constraints on how many
// elements can be in the queue.
type Queue[T any] struct {
	mu    sync.Mutex
	elems []T
	wait  *cond.Cond
}

// Push places elem at the back of the queue.
func (q *Queue[T]) Push(elem T) {
	q.mu.Lock()
	defer q.mu.Unlock()
	q.init()
	q.elems = append(q.elems, elem)
	q.wait.Signal()
}

// Pop removes the element from the front of the queue and returns it.
// It blocks if the queue is empty.
// It returns an error if the passed-in context is canceled.
func (q *Queue[T]) Pop(ctx context.Context) (elem T, err error) {
	if err = ctx.Err(); err != nil {
		return
	}
	q.mu.Lock()
	defer q.mu.Unlock()
	q.init()
	for len(q.elems) == 0 {
		if err = q.wait.Wait(ctx); err != nil {
			return
		}
	}
	elem = q.elems[0]
	q.elems = q.elems[1:]
	return
}

// init initializes the queue.
//
// REQUIRES: q.mu is held
func (q *Queue[T]) init() {
	if q.wait == nil {
		q.wait = cond.NewCond(&q.mu)
	}
}
