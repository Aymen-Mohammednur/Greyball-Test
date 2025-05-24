import { Resolver, Mutation } from '@nestjs/graphql';
import { UpdateAllRankingsUseCase } from 'src/application/ranking/ranking.usecase';

@Resolver()
export class RankingResolver {
  constructor(
    private readonly updateAllRankingsUseCase: UpdateAllRankingsUseCase,
  ) {}

  @Mutation(() => Boolean)
  async triggerRankingUpdate(): Promise<boolean> {
    return this.updateAllRankingsUseCase.execute();
  }
}
