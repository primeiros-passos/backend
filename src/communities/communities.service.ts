import { PrismaService } from 'src/prisma.service';
import { Injectable } from '@nestjs/common';
import { CreateCommunityDto } from './dto/create-community.dto';
import { UpdateCommunityDto } from './dto/update-community.dto';
import { Status } from '@prisma/client';

@Injectable()
export class CommunitiesService {
  constructor(private prisma: PrismaService) {}

  async create(createCommunityDto: CreateCommunityDto) {
    const data = {
      name: createCommunityDto.name,
      description: createCommunityDto.description,
      category: {
        connect: {
          id: createCommunityDto.id_category,
        },
      },
    };

    const community = await this.prisma.community.create({
      data,
      select: {
        id: true,
        name: true,
        description: true,
        status: true,
        id_category: true,
      },
    });

    if (createCommunityDto.id_user) {
      await this.prisma.moderator.create({
        data: {
          id_user: createCommunityDto.id_user,
          id_community: community.id,
        },
      });
    }

    return community;
  }

  findAll() {
    return this.prisma.community.findMany({
      where: { status: Status.APPROVED },
      select: {
        id: true,
        name: true,
        description: true,
        category: true,
        _count: true,
      },
      take: 6,
    });
  }

  findOne(id: string) {
    return this.prisma.community.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        description: true,
        category: true,
        _count: true,
      },
    });
  }

  async findRelatedCommunities(id: string) {
    const community = await this.prisma.community.findUnique({
      where: { id },
    });

    return this.prisma.community.findMany({
      where: {
        status: Status.APPROVED,
        id_category: community.id_category,
        NOT: { id },
      },
      select: {
        id: true,
        name: true,
        description: true,
        category: true,
        _count: true,
      },
    });
  }

  search(term: string, id_category: string) {
    return this.prisma.community.findMany({
      where: {
        AND: [
          {
            OR: [
              {
                name: {
                  contains: term,
                },
              },
              {
                description: {
                  contains: term,
                },
              },
            ],
          },
          {
            id_category,
          },
          {
            status: Status.APPROVED,
          },
        ],
      },
      select: {
        id: true,
        name: true,
        description: true,
        category: true,
        _count: true,
      },
    });
  }

  count() {
    return this.prisma.community.count({ where: { status: Status.APPROVED } });
  }

  async findCommunitiesByUser(id_user: string) {
    const mod_com = await this.prisma.moderator.findMany({
      where: { id_user },
      include: {
        community: {
          select: {
            id: true,
            name: true,
            description: true,
            category: true,
            _count: true,
          },
        },
      },
    });

    return mod_com.map((item) => item.community);
  }

  update(id: string, updateCommunityDto: UpdateCommunityDto) {
    return this.prisma.community.update({
      where: { id },
      data: { ...updateCommunityDto },
      select: {
        id: true,
        name: true,
        description: true,
      },
    });
  }

  remove(id: string) {
    return this.prisma.user.delete({ where: { id } });
  }
}
